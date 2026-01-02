# Backend Circular File Handling

This document outlines what the backend needs to handle circular file attachments.

## Current Frontend Behavior

The frontend sends files as **base64 encoded strings** in the request payload:

```javascript
// Frontend payload sent to POST /api/circulars
{
  title: "Announcement",
  eventName: "Team Meeting",
  body: "<p>Content here...</p>",
  targetType: "company",  // or "department", "role", "individual"
  file: "data:application/pdf;base64,JVBERi0xLjQKJ...",  // Base64 encoded file
  selectedDepartments: [1, 2],  // if targetType is "department"
  selectedRoles: [3, 4],        // if targetType is "role"
  selectedUsers: [5, 6]         // if targetType is "individual"
}
```

## Backend Requirements

### 1. Circular Model

Ensure your Circular model has these fields:

```javascript
// models/Circular.js
const Circular = sequelize.define('Circular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  targetType: {
    type: DataTypes.ENUM('company', 'department', 'role', 'individual'),
    allowNull: false,
    defaultValue: 'company'
  },
  // FILE FIELD - stores URL after upload to cloud storage
  attachment: {
    type: DataTypes.STRING(500),  // URL to stored file
    allowNull: true
  },
  // Or if storing base64 directly (not recommended for large files)
  file: {
    type: DataTypes.TEXT('long'),  // For base64 storage
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
});
```

### 2. Controller - Create Circular

```javascript
// controllers/circularController.js
const cloudinary = require('cloudinary').v2;

exports.createCircular = async (req, res) => {
  try {
    const {
      title,
      eventName,
      body,
      targetType,
      file,  // Base64 string from frontend
      selectedDepartments,
      selectedRoles,
      selectedUsers
    } = req.body;

    let attachmentUrl = null;

    // Handle file upload if provided
    if (file) {
      try {
        // Upload base64 to Cloudinary (or your preferred storage)
        const uploadResponse = await cloudinary.uploader.upload(file, {
          folder: 'circulars',
          resource_type: 'auto',  // Automatically detect file type
        });
        attachmentUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        // Continue without file if upload fails
      }
    }

    // Create the circular
    const circular = await Circular.create({
      title,
      eventName,
      body,
      targetType,
      attachment: attachmentUrl,  // Store the URL
      createdBy: req.user.id
    });

    // Handle target associations based on targetType
    if (targetType === 'department' && selectedDepartments?.length) {
      await CircularDepartment.bulkCreate(
        selectedDepartments.map(deptId => ({
          circularId: circular.id,
          departmentId: deptId
        }))
      );
    }

    if (targetType === 'role' && selectedRoles?.length) {
      await CircularRole.bulkCreate(
        selectedRoles.map(roleId => ({
          circularId: circular.id,
          roleId: roleId
        }))
      );
    }

    if (targetType === 'individual' && selectedUsers?.length) {
      await CircularUser.bulkCreate(
        selectedUsers.map(userId => ({
          circularId: circular.id,
          userId: userId
        }))
      );
    }

    // Create notifications for recipients
    await createCircularNotifications(circular);

    res.status(201).json({
      success: true,
      message: 'Circular created successfully',
      circular
    });

  } catch (error) {
    console.error('Error creating circular:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create circular',
      error: error.message
    });
  }
};
```

### 3. Controller - Get Circular by ID

```javascript
exports.getCircularById = async (req, res) => {
  try {
    const { id } = req.params;

    const circular = await Circular.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'surname', 'email']
        },
        {
          model: Department,
          as: 'departments',
          through: { attributes: [] }
        },
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }
      ]
    });

    if (!circular) {
      return res.status(404).json({
        success: false,
        message: 'Circular not found'
      });
    }

    // Return circular with attachment URL
    res.json({
      ...circular.toJSON(),
      attachment: circular.attachment,  // URL to file
      // Include response count if needed
      responseCount: await CircularResponse.count({ where: { circularId: id } })
    });

  } catch (error) {
    console.error('Error fetching circular:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch circular'
    });
  }
};
```

### 4. Alternative: Store Base64 Directly (Simple but not recommended for large files)

If you don't want to use cloud storage, you can store base64 directly:

```javascript
// In controller
const circular = await Circular.create({
  title,
  eventName,
  body,
  targetType,
  file: file,  // Store base64 directly
  createdBy: req.user.id
});
```

Then in the model, use:
```javascript
file: {
  type: DataTypes.TEXT('long'),  // Can store large base64 strings
  allowNull: true
}
```

**Note:** This approach is not recommended for production as:
- Base64 increases file size by ~33%
- Large files will slow down database queries
- Better to use cloud storage (Cloudinary, AWS S3, etc.)

## Frontend Expects

The frontend expects the response to include either:
- `attachment` - URL to the file (preferred)
- `file` - Base64 string (fallback)

```javascript
// CircularDetails.jsx checks for both
{(circular?.attachment || circular?.file) && (
  // Display attachment
)}
```

## Testing

1. Create a circular with a file attachment
2. Check database - attachment URL should be stored
3. View circular details - file should display with View/Download buttons
4. Test with different file types (PDF, images, documents)

## Checklist

- [ ] Circular model has `attachment` field (STRING for URL)
- [ ] Create circular controller handles `file` from request body
- [ ] File is uploaded to cloud storage (Cloudinary/S3)
- [ ] Attachment URL is saved to database
- [ ] Get circular returns `attachment` field
- [ ] Delete circular also deletes file from storage (optional)


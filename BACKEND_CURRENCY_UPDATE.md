# Backend Currency Field Update

This document outlines the changes needed in your backend to support the currency field.

## 1. Database Migration

Add the `currency` and `currencySymbol` columns to your Request model/table:

### If using Sequelize:

```javascript
// migrations/YYYYMMDDHHMMSS-add-currency-to-requests.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Requests', 'currency', {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: 'USD',
    });
    
    await queryInterface.addColumn('Requests', 'currencySymbol', {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: '$',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Requests', 'currency');
    await queryInterface.removeColumn('Requests', 'currencySymbol');
  }
};
```

### Run migration:
```bash
npx sequelize-cli db:migrate
```

## 2. Update Request Model

Add the currency fields to your Request model:

```javascript
// models/Request.js
currency: {
  type: DataTypes.STRING(10),
  allowNull: true,
  defaultValue: 'USD',
  validate: {
    isIn: {
      args: [['NGN', 'USD', 'EUR', 'GBP', 'GHS', 'KES', 'ZAR', 'INR', 'AED', 'CAD', 'AUD', 'JPY', 'CNY', 'CHF', 'SGD', 'HKD', 'MXN', 'BRL']],
      msg: 'Invalid currency code'
    }
  }
},
currencySymbol: {
  type: DataTypes.STRING(10),
  allowNull: true,
  defaultValue: '$',
},
```

## 3. Update Request Controller

Make sure your controller accepts and saves the currency fields:

```javascript
// controllers/requestController.js

// In createRequest function:
const createRequest = async (req, res) => {
  try {
    const {
      requestType,
      title,
      description,
      amount,
      currency,        // NEW
      currencySymbol,  // NEW
      vendor,
      paymentMethod,
      dateNeeded,
      // ... other fields
    } = req.body;

    const request = await Request.create({
      requestType,
      title,
      description,
      amount: amount ? parseFloat(amount) : null,
      currency: currency || 'USD',           // NEW - default to USD if not provided
      currencySymbol: currencySymbol || '$', // NEW - default to $ if not provided
      vendor,
      paymentMethod,
      dateNeeded,
      userId: req.user.id,
      // ... other fields
    });

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create request',
      error: error.message,
    });
  }
};
```

## 4. Update Request Validation (if using)

```javascript
// validators/requestValidator.js
const createRequestSchema = Joi.object({
  requestType: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  amount: Joi.number().positive().allow(null),
  currency: Joi.string().valid('NGN', 'USD', 'EUR', 'GBP', 'GHS', 'KES', 'ZAR', 'INR', 'AED', 'CAD', 'AUD').default('USD'),
  currencySymbol: Joi.string().max(10).default('$'),
  // ... other fields
});
```

## 5. Currency Helper Utility (Optional)

Create a utility function to format currency amounts:

```javascript
// utils/currencyFormatter.js
const currencySymbols = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: '₵',
  KES: 'KSh',
  ZAR: 'R',
  INR: '₹',
  AED: 'د.إ',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
};

const formatCurrency = (amount, currencyCode = 'USD') => {
  const symbol = currencySymbols[currencyCode] || currencyCode;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return `${symbol}${formattedAmount}`;
};

const getCurrencySymbol = (currencyCode) => {
  return currencySymbols[currencyCode] || currencyCode;
};

module.exports = { formatCurrency, getCurrencySymbol, currencySymbols };
```

## 6. Update API Response (Optional)

When returning requests, include formatted currency display:

```javascript
// In getRequests or getRequestById
const requests = await Request.findAll({ /* ... */ });

const formattedRequests = requests.map(request => ({
  ...request.toJSON(),
  formattedAmount: request.amount 
    ? `${request.currencySymbol || '$'}${parseFloat(request.amount).toLocaleString()}`
    : null,
}));
```

## Summary of Changes

| File | Changes |
|------|---------|
| `migrations/` | Add currency and currencySymbol columns |
| `models/Request.js` | Add currency and currencySymbol fields |
| `controllers/requestController.js` | Accept and save currency fields |
| `validators/` | Add currency validation rules |
| `utils/currencyFormatter.js` | (Optional) Currency formatting helper |

## Testing

After implementing these changes:

1. Run the migration: `npx sequelize-cli db:migrate`
2. Test creating a request with different currencies
3. Verify the currency is saved correctly in the database
4. Check that existing requests still work (defaulting to USD)


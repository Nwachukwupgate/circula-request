import { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { MessageCircle, Send } from 'lucide-react';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import {
  useGetMySupportTicketsQuery,
  useGetSupportTicketQuery,
  useCreateSupportTicketMutation,
  useReplySupportTicketMutation,
} from 'api/apiSlice';
import { toast } from 'react-toastify';

const statusColor = {
  open: 'warning',
  in_progress: 'info',
  waiting: 'secondary',
  resolved: 'success',
  closed: 'default',
};

function TicketThread({ ticketId, onClose }) {
  const { data, isLoading, refetch } = useGetSupportTicketQuery(ticketId);
  const [reply, setReply] = useState('');
  const [replyToTicket, { isLoading: sending }] = useReplySupportTicketMutation();

  const ticket = data?.data;

  const handleReply = async () => {
    if (!reply.trim()) return;
    try {
      await replyToTicket({ ticketId, message: reply.trim() }).unwrap();
      toast.success('Reply sent');
      setReply('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send reply');
    }
  };

  if (isLoading || !ticket) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <>
      <MDTypography variant="h6" fontWeight="bold" mb={1}>
        #{ticket.id} · {ticket.subject}
      </MDTypography>
      <Chip size="small" label={ticket.status.replace('_', ' ')} color={statusColor[ticket.status]} sx={{ mb: 2 }} />
      <Box maxHeight={280} overflow="auto" mb={2}>
        {(ticket.messages || []).map((m) => (
          <Box key={m.id} mb={2}>
            <Typography variant="caption" color="text">
              {m.authorName || m.authorType} · {new Date(m.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" mt={0.5}>
              {m.message}
            </Typography>
            <Divider sx={{ mt: 1.5 }} />
          </Box>
        ))}
      </Box>
      {!['closed', 'resolved'].includes(ticket.status) && (
        <>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a follow-up…"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            sx={{ mb: 2 }}
          />
          <MDButton variant="gradient" color="info" onClick={handleReply} disabled={sending}>
            Send reply
          </MDButton>
        </>
      )}
      <MDButton variant="text" color="secondary" onClick={onClose} sx={{ ml: 1 }}>
        Back
      </MDButton>
    </>
  );
}

export default function ContactSupportPanel({ compact = false }) {
  const { data, isLoading, refetch } = useGetMySupportTicketsQuery();
  const [createTicket, { isLoading: creating }] = useCreateSupportTicketMutation();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: 'other',
    priority: 'medium',
  });

  const tickets = data?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(form).unwrap();
      toast.success('Support ticket submitted. Check your email for confirmation.');
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit ticket');
    }
  };

  if (selectedTicketId) {
    return (
      <Card sx={{ p: compact ? 2 : 3, borderRadius: 3 }}>
        <TicketThread ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} />
      </Card>
    );
  }

  return (
    <GridLike compact={compact}>
      <Card sx={{ p: compact ? 2 : 3, borderRadius: 3, height: '100%' }}>
        <MDBox display="flex" alignItems="center" gap={1} mb={2}>
          <MessageCircle size={20} />
          <MDTypography variant="h6" fontWeight="bold">
            Contact support
          </MDTypography>
        </MDBox>
        <MDTypography variant="body2" color="text" mb={2}>
          Submit a ticket and our team will respond by email. You can track replies here.
        </MDTypography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            sx={{ mb: 2 }}
            size="small"
          />
          <TextField
            fullWidth
            required
            multiline
            rows={compact ? 3 : 4}
            label="How can we help?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ mb: 2 }}
            size="small"
          />
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <TextField
              select
              size="small"
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="billing">Billing</MenuItem>
              <MenuItem value="complaint">Complaint</MenuItem>
              <MenuItem value="feature">Feature request</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
          </Box>
          <MDButton type="submit" variant="gradient" color="info" disabled={creating} startIcon={<Send size={16} />}>
            {creating ? 'Submitting…' : 'Submit ticket'}
          </MDButton>
        </Box>
      </Card>

      <Card sx={{ p: compact ? 2 : 3, borderRadius: 3, height: '100%' }}>
        <MDTypography variant="h6" fontWeight="bold" mb={2}>
          My tickets
        </MDTypography>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : tickets.length === 0 ? (
          <MDTypography variant="body2" color="text">
            No tickets yet.
          </MDTypography>
        ) : (
          tickets.map((t) => (
            <Box
              key={t.id}
              py={1.5}
              borderBottom="1px solid #eee"
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
              onClick={() => setSelectedTicketId(t.id)}
            >
              <MDTypography variant="button" fontWeight="medium">
                #{t.id} {t.subject}
              </MDTypography>
              <Box display="flex" gap={1} mt={0.5}>
                <Chip size="small" label={t.status.replace('_', ' ')} color={statusColor[t.status]} />
                <Typography variant="caption" color="text">
                  {new Date(t.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Card>
    </GridLike>
  );
}

function GridLike({ children, compact }) {
  if (compact) {
    return <Box display="flex" flexDirection="column" gap={2}>{children}</Box>;
  }
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
      gap={3}
    >
      {children}
    </Box>
  );
}

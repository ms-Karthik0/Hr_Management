import { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle2, Plus, X } from 'lucide-react';
import { attendance, leaves } from '../services/api';
import { Badge, Card, PageIntro, Table } from '../components/UI';

export default function AttendanceLeave() {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [leaveRows, setLeaveRows] = useState([]);
  const [form, setForm] = useState({});
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const load = () => Promise.all([attendance.me(), leaves.me()])
    .then(([attendanceResponse, leaveResponse]) => {
      setAttendanceRows(attendanceResponse.data || []);
      setLeaveRows(leaveResponse.data || []);
    })
    .catch(() => {});

  useEffect(load, []);

  const mark = async status => {
    const now = new Date();
    await attendance.create({
      status,
      date: now.toISOString().slice(0, 10),
      checkIn: now.toISOString(),
      checkOut: null,
      notes: '',
    });
    load();
  };

  const submitLeave = async event => {
    event.preventDefault();
    await leaves.create(form);
    setShowLeaveForm(false);
    setForm({});
    load();
  };

  return (
    <>
      <PageIntro
        eyebrow="People operations"
        title="Attendance & leave"
        action={(
          <div className="actions">
            <button className="secondary" onClick={() => mark('PRESENT')}>
              <CheckCircle2 size={16} /> Check in
            </button>
            <button className="primary" onClick={() => setShowLeaveForm(true)}>
              <Plus size={16} /> Request leave
            </button>
          </div>
        )}
      >
        Track attendance and manage leave requests with a single employee workspace.
      </PageIntro>

      <div className="grid-2">
        <Card>
          <div className="card-head">
            <div><span className="eyebrow">Attendance</span><h3>My attendance</h3></div>
            <CalendarDays size={18} />
          </div>
          <Table columns={[
            { key: 'workDate', label: 'Date', render: row => row.workDate || row.date },
            { key: 'status', label: 'Status', render: row => <Badge tone="success">{row.status}</Badge> },
            { key: 'checkIn', label: 'Check in', render: row => row.checkIn ? new Date(row.checkIn).toLocaleString() : '' },
          ]} rows={attendanceRows} />
        </Card>

        <Card>
          <div className="card-head">
            <div><span className="eyebrow">Leave</span><h3>My requests</h3></div>
          </div>
          <Table columns={[
            { key: 'leaveType', label: 'Type' },
            { key: 'startDate', label: 'From' },
            { key: 'endDate', label: 'To' },
            { key: 'status', label: 'Status', render: row => <Badge tone={row.status === 'APPROVED' ? 'success' : row.status === 'REJECTED' ? 'danger' : ''}>{row.status}</Badge> },
          ]} rows={leaveRows} />
        </Card>
      </div>

      {showLeaveForm && (
        <div className="modal">
          <form className="modal-card" onSubmit={submitLeave}>
            <div className="card-head">
              <h3>Request leave</h3>
              <button type="button" className="icon-btn" onClick={() => setShowLeaveForm(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="form-grid">
              <label>Leave type
                <select value={form.leaveType || 'ANNUAL'} onChange={event => setForm({ ...form, leaveType: event.target.value })}>
                  <option value="ANNUAL">Annual</option>
                  <option value="SICK">Sick</option>
                  <option value="PERSONAL">Personal</option>
                </select>
              </label>
              <label>Reason
                <textarea value={form.reason || ''} onChange={event => setForm({ ...form, reason: event.target.value })} />
              </label>
              <label>Start date
                <input type="date" value={form.startDate || ''} onChange={event => setForm({ ...form, startDate: event.target.value })} />
              </label>
              <label>End date
                <input type="date" value={form.endDate || ''} onChange={event => setForm({ ...form, endDate: event.target.value })} />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowLeaveForm(false)}>Cancel</button>
              <button type="submit" className="primary">Submit request</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
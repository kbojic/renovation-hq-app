"use client";

import { useMemo, useState } from "react";

type Tab = "dashboard" | "budget" | "contacts" | "quotes" | "files" | "decisions" | "timeline" | "advisor" | "sharing";

const tabs: Array<[Tab, string]> = [
  ["dashboard", "Command"],
  ["budget", "Budget"],
  ["contacts", "Outreach"],
  ["quotes", "Quotes"],
  ["files", "Files"],
  ["decisions", "Decisions"],
  ["timeline", "Timeline"],
  ["advisor", "Advisor"],
  ["sharing", "Sharing"]
];

const initialBudget = [
  { id: "1", name: "Design and permits", budgeted: 6500, committed: 0, paid: 0, status: "planned", vendor: "", notes: "Need permit assumptions from GC" },
  { id: "2", name: "Demo and disposal", budgeted: 5500, committed: 0, paid: 0, status: "planned", vendor: "", notes: "" },
  { id: "3", name: "Cabinets and carpentry", budgeted: 24000, committed: 0, paid: 0, status: "planned", vendor: "", notes: "Ask about lead times" },
  { id: "4", name: "Counters and tile", budgeted: 12500, committed: 11800, paid: 0, status: "quoted", vendor: "Stone Harbor Surfaces", notes: "" },
  { id: "5", name: "Plumbing", budgeted: 8500, committed: 7200, paid: 0, status: "quoted", vendor: "ClearPipe Plumbing", notes: "Bath leak scope TBD" }
];

const initialContacts = [
  { id: "1", company: "Northline Renovation", status: "contacted", phone: "(617) 555-0198", email: "mara@northline.example", quoted: 0 },
  { id: "2", company: "ClearPipe Plumbing", status: "walkthrough", phone: "(617) 555-0162", email: "service@clearpipe.example", quoted: 7200 },
  { id: "3", company: "Stone Harbor Surfaces", status: "bid", phone: "(617) 555-0107", email: "lena@stoneharbor.example", quoted: 11800 }
];

export default function RenovationApp() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [budget, setBudget] = useState(initialBudget);
  const [contacts, setContacts] = useState(initialContacts);
  const [chat, setChat] = useState([{ role: "assistant", content: "Ask me what needs attention, whether budget is tight, or who to follow up with." }]);
  const [message, setMessage] = useState("");

  const totals = useMemo(() => {
    const budgeted = budget.reduce((sum, row) => sum + row.budgeted, 0);
    const committed = budget.reduce((sum, row) => sum + row.committed, 0);
    const paid = budget.reduce((sum, row) => sum + row.paid, 0);
    const ceiling = 85000;
    const contingency = Math.round(ceiling * 0.15);
    const spendable = ceiling - contingency;
    return { budgeted, committed, paid, ceiling, contingency, spendable };
  }, [budget]);

  function updateBudget(id: string, field: string, value: string) {
    setBudget(rows =>
      rows.map(row =>
        row.id === id
          ? { ...row, [field]: ["budgeted", "committed", "paid"].includes(field) ? Number(value || 0) : value }
          : row
      )
    );
  }

  function exportBudget() {
    const rows = [
      ["Line item", "Budgeted", "Committed", "Paid", "Status", "Vendor", "Notes"],
      ...budget.map(row => [row.name, row.budgeted, row.committed, row.paid, row.status, row.vendor, row.notes])
    ];
    const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renovation-budget.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function askAdvisor(prompt: string) {
    let reply = "Focus on follow-ups, comparable bids, and protecting contingency.";
    if (prompt.toLowerCase().includes("budget")) {
      reply = `Spendable budget is ${money(totals.spendable)}. You have ${money(totals.committed)} committed and ${money(totals.paid)} paid. Keep contingency protected until scope is signed.`;
    }
    if (prompt.toLowerCase().includes("follow")) {
      reply = "Follow up with Northline Renovation and ClearPipe Plumbing. Ask for written scope, exclusions, quote timing, and earliest start date.";
    }
    setChat([...chat, { role: "user", content: prompt }, { role: "assistant", content: reply }]);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Renovation HQ</h1>
        <p className="muted">Mom's Kitchen and Bath Launch</p>
        <div className="grid">
          {tabs.map(([id, label]) => (
            <button className="btn" key={id} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        <div className="row">
          <div>
            <h2>{title(tab)}</h2>
            <p className="muted">Budget, contractors, documents, decisions, timeline, sharing, and advisor.</p>
          </div>
          <button className="btn primary" onClick={exportBudget}>Export Budget</button>
        </div>

        {tab === "dashboard" && (
          <div className="grid">
            <div className="panel">
              <h3>Project status</h3>
              <p>Keep disruption low, make the kitchen brighter and safer, refresh the bath leak area, and avoid surprise invoices.</p>
            </div>
            <div className="panel">
              <p>Spendable: <strong>{money(totals.spendable)}</strong></p>
              <p>Committed: <strong>{money(totals.committed)}</strong></p>
              <p>Paid: <strong>{money(totals.paid)}</strong></p>
              <p>Contacts: <strong>{contacts.length}</strong></p>
            </div>
          </div>
        )}

        {tab === "budget" && (
          <div className="panel">
            <h3>Budget</h3>
            <table>
              <thead>
                <tr><th>Line</th><th>Budgeted</th><th>Committed</th><th>Paid</th><th>Status</th><th>Vendor</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {budget.map(row => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td><input value={row.budgeted} onChange={e => updateBudget(row.id, "budgeted", e.target.value)} /></td>
                    <td><input value={row.committed} onChange={e => updateBudget(row.id, "committed", e.target.value)} /></td>
                    <td><input value={row.paid} onChange={e => updateBudget(row.id, "paid", e.target.value)} /></td>
                    <td><input value={row.status} onChange={e => updateBudget(row.id, "status", e.target.value)} /></td>
                    <td><input value={row.vendor} onChange={e => updateBudget(row.id, "vendor", e.target.value)} /></td>
                    <td><input value={row.notes} onChange={e => updateBudget(row.id, "notes", e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "contacts" && (
          <div className="grid">
            {contacts.map(contact => (
              <div className="panel" key={contact.id}>
                <h3>{contact.company}</h3>
                <p>{contact.status}</p>
                <p>{contact.phone}</p>
                <p>{contact.email}</p>
                <p>{contact.quoted ? `Quote: ${money(contact.quoted)}` : "No quote yet"}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "quotes" && (
          <div className="panel">
            <h3>Quote comparison</h3>
            {contacts.filter(c => c.quoted).map(contact => (
              <p key={contact.id}>{contact.company}: <strong>{money(contact.quoted)}</strong></p>
            ))}
          </div>
        )}

        {tab === "files" && <div className="panel"><h3>Documents and photos</h3><p>After Supabase is wired, upload quotes, invoices, photos, permits, and licenses here.</p></div>}
        {tab === "decisions" && <div className="panel"><h3>Decisions and change orders</h3><p>Track approvals, pending decisions, and change orders here.</p></div>}
        {tab === "timeline" && <div className="panel"><h3>Timeline and reminders</h3><p>Track follow-ups, walkthroughs, and deadlines here.</p></div>}
        {tab === "sharing" && <div className="panel"><h3>Sharing and invites</h3><p>Invite family and contractors after Supabase auth is connected.</p></div>}

        {tab === "advisor" && (
          <div className="panel">
            <h3>Advisor</h3>
            {chat.map((entry, index) => (
              <p key={index}><strong>{entry.role}:</strong> {entry.content}</p>
            ))}
            <form onSubmit={e => { e.preventDefault(); if (message.trim()) { askAdvisor(message); setMessage(""); } }}>
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask about budget or follow-ups" />
              <button className="btn primary">Send</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function title(tab: Tab) {
  return {
    dashboard: "Command center",
    budget: "Budget",
    contacts: "Contractor outreach",
    quotes: "Quote comparison",
    files: "Documents and photos",
    decisions: "Decisions",
    timeline: "Timeline",
    advisor: "Advisor",
    sharing: "Sharing"
  }[tab];
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

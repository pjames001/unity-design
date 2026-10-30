import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { CLIENT } from "@/data/client";
import { Check, Mail } from "lucide-react";

export const PORTAL_PERMISSIONS = [
  { key: "editStatus", label: "Edit collection status" },
  { key: "editAccount", label: "Edit account" },
  { key: "searchAccount", label: "Search for account" },
  { key: "enterPayments", label: "Enter payments" },
  { key: "uploadDocuments", label: "Upload documents" },
  { key: "uploadClientFiles", label: "Upload client files" },
];

export const PORTAL_FIELDS = [
  { key: "firstDelinquency", label: "First delinquency date" },
  { key: "originatedDate", label: "Originated date" },
  { key: "debtorEmployer", label: "Debtor employer" },
  { key: "debtorNotes", label: "Show debtor notes" },
  { key: "callNotes", label: "Show call notes" },
  { key: "accountNotes", label: "Show account notes" },
  { key: "documentNotes", label: "Show document notes" },
];

export default function ClientPortal() {
  const [enabled, setEnabled] = useState(true);
  const [username, setUsername] = useState("westfield.finance");
  const [sentAt, setSentAt] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({ searchAccount: true, uploadDocuments: true });
  const [fields, setFields] = useState<Record<string, boolean>>({ originatedDate: true, accountNotes: true });

  const fieldClass = "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-[14px] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-brand disabled:cursor-not-allowed";

  const toggleGroup = (
    title: string,
    sub: string,
    items: Array<{ key: string; label: string }>,
    state: Record<string, boolean>,
    setState: (next: Record<string, boolean>) => void,
  ) => {
    const allOn = items.every((item) => state[item.key]);
    const onCount = items.filter((item) => state[item.key]).length;
    return (
      <Card className="h-full overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="text-[16px] font-semibold text-brand">{title}</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">{sub} · {onCount} of {items.length} on</p>
          </div>
          <ToggleSwitch
            checked={allOn}
            onChange={(next) => setState(Object.fromEntries(items.map((item) => [item.key, next])))}
            label="Enable all"
          />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5">
          {items.map((item) => (
            <ToggleSwitch
              key={item.key}
              checked={Boolean(state[item.key])}
              onChange={(next) => setState({ ...state, [item.key]: next })}
              label={item.label}
            />
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="section-head flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5">
          <div>
            <h3 className="text-[16px] font-semibold text-brand">Portal Access</h3>
            <p className="mt-0.5 text-[13px] text-[var(--muted-foreground)]">Let this client sign in to view and manage their placed accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={enabled ? "Enabled" : "Disabled"} variant={enabled ? "success" : "outline"} className="text-[13px]" />
            <ToggleSwitch checked={enabled} onChange={setEnabled} label="Portal enabled" hideLabel />
          </div>
        </div>
        <fieldset disabled={!enabled} className="flex flex-wrap items-end gap-4 p-5 transition-opacity disabled:opacity-50">
          <label className="w-80">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Username</span>
            <input value={username} onChange={(event) => { setUsername(event.target.value); setSentAt(null); }} placeholder="client.username" className={fieldClass} />
          </label>
          <button
            type="button"
            disabled={!username.trim()}
            onClick={() => setSentAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }))}
            className="btn btn-primary h-10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail size={13} />
            Send Temporary Password
          </button>
          {sentAt && (
            <span className="flex h-10 items-center gap-1.5 text-[14px] font-medium text-emerald-500">
              <Check size={14} />
              Temporary password sent to {CLIENT.email} at {sentAt}
            </span>
          )}
        </fieldset>
      </Card>

      <fieldset disabled={!enabled} className="grid grid-cols-2 items-stretch gap-5 transition-opacity disabled:opacity-50">
        {toggleGroup("Permissions", "What the client can do in the portal", PORTAL_PERMISSIONS, permissions, setPermissions)}
        {toggleGroup("Show Fields", "Account details visible to the client", PORTAL_FIELDS, fields, setFields)}
      </fieldset>
    </div>
  );
}

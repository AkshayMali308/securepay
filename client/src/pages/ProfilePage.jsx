import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { getMe, updateMe, updateKYC } from "../api/userApi";
import Badge from "../components/ui/Badge";
import { UserCircleIcon, IdentificationIcon, ShieldCheckIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const TABS = [
  { id: "profile",  label: "Profile",  icon: UserCircleIcon },
  { id: "kyc",      label: "KYC",      icon: IdentificationIcon },
  { id: "security", label: "Security", icon: ShieldCheckIcon },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ fullName: "", phone: "", address: { street: "", city: "", state: "", pincode: "" } });
  const [kyc, setKyc] = useState({ panNumber: "", aadhaarLast4: "", dob: "" });
  const [kycStatus, setKycStatus] = useState("not_submitted");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  useEffect(() => {
    getMe().then((r) => {
      const { user: u, kyc: k } = r.data.data;
      setProfile({ fullName: u.fullName || "", phone: u.phone || "", address: u.address || { street: "", city: "", state: "", pincode: "" } });
      if (k) {
        setKycStatus(k.status);
        setKyc({ panNumber: k.panNumber || "", aadhaarLast4: k.aadhaarLast4 || "", dob: k.dob ? k.dob.split("T")[0] : "" });
      }
    });
  }, []);

  const showMsg = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: "", ok: true }), 3000); };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const r = await updateMe(profile);
      dispatch(setUser(r.data.data.user));
      showMsg("Profile updated successfully!");
    } catch (e) { showMsg(e.response?.data?.message || "Failed to update", false); }
    finally { setSaving(false); }
  };

  const handleSubmitKYC = async () => {
    setSaving(true);
    try {
      await updateKYC(kyc);
      setKycStatus("pending");
      showMsg("KYC submitted! It is now under review.");
    } catch (e) { showMsg(e.response?.data?.message || "KYC submission failed", false); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your profile, KYC, and security</p>
      </div>

      {/* User card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {user?.fullName?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">{user?.fullName}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="flex gap-2 mt-1.5">
            <Badge label={`ID: ${user?.customerId}`} />
            <Badge label={user?.role} variant={user?.role === "admin" ? "pending" : "default"} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["fullName", "Full Name"], ["phone", "Phone"]].map(([k, l]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{l}</label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile[k]}
                  onChange={(e) => setProfile((p) => ({ ...p, [k]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-500 text-sm cursor-not-allowed" value={user?.email} disabled />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["street", "city", "state", "pincode"].map((f) => (
              <div key={f}>
                <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{f}</label>
                <input
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={profile.address?.[f] || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, address: { ...p.address, [f]: e.target.value } }))}
                />
              </div>
            ))}
          </div>
          {msg.text && (
            <p className={`text-sm px-4 py-2 rounded-lg ${msg.ok ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "bg-red-50 text-red-700 dark:bg-red-900/20"}`}>
              {msg.text}
            </p>
          )}
          <button onClick={handleSaveProfile} disabled={saving} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      )}

      {/* KYC tab */}
      {tab === "kyc" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">KYC Verification</h3>
            <Badge
              label={kycStatus === "not_submitted" ? "Not Submitted" : kycStatus === "pending" ? "Under Review" : kycStatus === "verified" ? "Verified" : "Rejected"}
              variant={kycStatus === "verified" ? "success" : kycStatus === "pending" ? "pending" : kycStatus === "rejected" ? "failed" : "default"}
            />
          </div>
          {kycStatus === "verified" ? (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white">Your identity is verified</p>
              <p className="text-sm text-gray-500 mt-1">Full transfer limits are enabled</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-xl px-4 py-3">
                ℹ️ This is a demo KYC flow. No real documents are required.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PAN Number</label>
                  <input placeholder="ABCDE1234F" maxLength={10} disabled={kycStatus === "pending"}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm uppercase focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60"
                    value={kyc.panNumber} onChange={(e) => setKyc((k) => ({ ...k, panNumber: e.target.value.toUpperCase() }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aadhaar Last 4</label>
                  <input placeholder="1234" maxLength={4} disabled={kycStatus === "pending"}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60"
                    value={kyc.aadhaarLast4} onChange={(e) => setKyc((k) => ({ ...k, aadhaarLast4: e.target.value.replace(/\D/g, "") }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                  <input type="date" disabled={kycStatus === "pending"}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-60"
                    value={kyc.dob} onChange={(e) => setKyc((k) => ({ ...k, dob: e.target.value }))} />
                </div>
              </div>
              {msg.text && (
                <p className={`text-sm px-4 py-2 rounded-lg ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{msg.text}</p>
              )}
              <button onClick={handleSubmitKYC} disabled={saving || kycStatus === "pending"}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {kycStatus === "pending" ? "Awaiting Review..." : saving ? "Submitting..." : "Submit KYC"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Security tab */}
      {tab === "security" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Security Settings</h3>
          {[
            { label: "Password", desc: "Change your login password", action: "Change", onClick: () => window.location.href = "/forgot-password" },
            { label: "Two-Factor Auth", desc: "Coming soon", action: "Enable", onClick: () => {}, disabled: true },
            { label: "Active Sessions", desc: "Coming soon", action: "View", onClick: () => {}, disabled: true },
          ].map(({ label, desc, action, onClick, disabled }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <button onClick={onClick} disabled={disabled}
                className="px-4 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                {action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

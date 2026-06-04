import { Link } from "react-router-dom";
import { ShieldCheckIcon, BoltIcon, ChartBarIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

const features = [
  { icon: ShieldCheckIcon, title: "Bank-Grade Security",  desc: "JWT auth, bcrypt hashing, rate limiting and HTTPS throughout." },
  { icon: BoltIcon,        title: "Instant Transfers",    desc: "Send money to any SecurePay user in seconds with atomic transactions." },
  { icon: ChartBarIcon,    title: "Full Analytics",       desc: "Track all transactions, filter by date and type, export to CSV." },
  { icon: DevicePhoneMobileIcon, title: "Mobile Friendly",desc: "Fully responsive design that works on any device." },
];

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
    <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="font-bold text-sm">SP</span>
        </div>
        <span className="font-bold text-lg">SecurePay</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-sm text-blue-300 hover:text-white transition-colors">Sign In</Link>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          Get Started
        </Link>
      </div>
    </nav>

    <div className="text-center px-6 py-24 md:py-36 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-8">
        <ShieldCheckIcon className="w-4 h-4" /> Secure · Fast · Reliable
      </div>
      <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
        Your Money,{" "}
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Under Control
        </span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
        SecurePay is a digital wallet that lets you send money, track transactions, and manage your finances — securely and instantly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-2xl text-lg transition-all hover:scale-105">
          Open Free Account
        </Link>
        <Link to="/login" className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-2xl text-lg transition-colors">
          Sign In
        </Link>
      </div>
    </div>

    <div className="px-6 md:px-12 pb-24 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {features.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>

    <div className="text-center py-8 border-t border-white/10 text-sm text-slate-500">
      © {new Date().getFullYear()} SecurePay — Portfolio project, not a real bank.
    </div>
  </div>
);

export default LandingPage;

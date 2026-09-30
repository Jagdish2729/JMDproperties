import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown, MapPin, Phone, Search, ShieldCheck, X } from "lucide-react";

const properties = [
  { title: "3 BHK · Sector 150", meta: "Noida · 1,650 sq.ft.", price: "₹92 L", tag: "Verified" },
  { title: "2 BHK · Sector 137", meta: "Noida · 1,180 sq.ft.", price: "₹68 L", tag: "Owner verified" },
  { title: "3 BHK · Techzone 4", meta: "Greater Noida West · 1,540 sq.ft.", price: "₹84 L", tag: "Fresh listing" },
];

type Intent = "BUY" | "SELL";

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("BUY");
  const [submitted, setSubmitted] = useState(false);

  const openForm = (nextIntent?: Intent) => {
    if (nextIntent) setIntent(nextIntent);
    setSubmitted(false);
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lead = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      location: String(formData.get("location") || ""),
      lookingFor: String(formData.get("lookingFor") || ""),
      intent,
      createdAt: new Date().toISOString(),
    };

    // Temporary local save until the PostgreSQL API is connected.
    const leads = JSON.parse(localStorage.getItem("jmd-leads") || "[]");
    localStorage.setItem("jmd-leads", JSON.stringify([...leads, lead]));
    setSubmitted(true);
  };

  return <main>
    <nav className="nav shell">
      <a className="brand" href="#"><span>JMD</span><small>PROPERTIES</small></a>
      <div className="nav-links"><a href="#buy">Buy</a><a href="#sell">Sell</a><a href="#how">How it works</a></div>
      <button className="nav-cta" onClick={() => openForm()}>Talk to us <ArrowUpRight size={17}/></button>
    </nav>

    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse"/> PROPERTY, WITHOUT THE DRAMA.</p>
        <h1>Find your place.<br/><em>We'll handle the rest.</em></h1>
        <p className="hero-sub">Tell us what you need. Our local team finds the right property, connects the dots and stays with you till the deal is done.</p>
        <div className="intent-card">
          <div className="intent-label">I WANT TO</div>
          <div className="intent-actions">
            <button className="intent buy" onClick={() => openForm("BUY")}><span>BUY</span><ArrowUpRight/></button>
            <button className="intent sell" onClick={() => openForm("SELL")}><span>SELL</span><ArrowUpRight/></button>
          </div>
          <div className="search-row"><div><MapPin size={18}/><span>Noida, Greater Noida</span></div><button onClick={() => openForm("BUY")}><Search size={18}/> Find a property</button></div>
        </div>
      </div>
      <div className="hero-art" aria-label="JMD Properties visual">
        <div className="art-card art-back"><span>LIVE<br/>LOCAL.</span></div>
        <div className="art-card art-main"><div className="window-grid"/><div className="art-copy"><small>JMD / 001</small><strong>YOUR<br/>NEXT<br/><i>MOVE.</i></strong></div></div>
        <div className="floating-stat"><ShieldCheck size={19}/><div><b>Verified</b><span>by our local team</span></div></div>
      </div>
    </section>

    <section className="trust shell"><span>BUILT AROUND PEOPLE, NOT LISTINGS.</span><div><b>01</b> Real people</div><div><b>02</b> Verified homes</div><div><b>03</b> Local knowledge</div></section>

    <section className="section shell" id="buy">
      <div className="section-head"><div><p className="eyebrow">EXPLORE</p><h2>Properties worth<br/><em>looking at.</em></h2></div><button className="text-link" onClick={() => openForm("BUY")}>See all properties <ArrowUpRight size={17}/></button></div>
      <div className="property-grid">{properties.map((p,i)=><article className="property" key={p.title}><div className={"property-image image-"+(i+1)}><span>{p.tag}</span><div className="image-mark">JMD</div></div><div className="property-info"><div><h3>{p.title}</h3><p>{p.meta}</p></div><strong>{p.price}</strong></div><button className="interest" onClick={() => openForm("BUY")}>I'm interested <ArrowUpRight size={16}/></button></article>)}</div>
    </section>

    <section className="how shell" id="how"><div><p className="eyebrow">NO RUNAROUND</p><h2>Property search,<br/><em>but human.</em></h2></div><div className="steps"><div><b>01</b><h3>Tell us what you want</h3><p>Budget, location, BHK, vibe. Keep it simple.</p></div><div><b>02</b><h3>We find the match</h3><p>Our local team filters the noise and brings you relevant options.</p></div><div><b>03</b><h3>We stay till done</h3><p>Visits, conversations and negotiation — all through JMD.</p></div></div></section>

    <section className="sell-banner shell" id="sell"><div><p className="eyebrow">OWN A PROPERTY?</p><h2>Don't just list it.<br/><em>Let's sell it.</em></h2><p>Put your property in front of genuine buyers and let our local team handle the first conversation.</p></div><button onClick={() => openForm("SELL")}>List my property <ArrowUpRight/></button></section>

    <footer className="footer shell"><div className="brand"><span>JMD</span><small>PROPERTIES</small></div><p>Find your place. Without the property drama.</p><div className="footer-right"><a href="#">Privacy</a><a href="#">Terms</a><button onClick={() => openForm()}><Phone size={15}/> Contact</button></div></footer>

    {formOpen && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
      <div className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-title">
        <button className="modal-close" aria-label="Close form" onClick={closeForm}><X size={19}/></button>
        {!submitted ? <>
          <div className="modal-kicker">JMD PROPERTIES</div>
          <h2 id="lead-title">Let's make your<br/><em>next move.</em></h2>
          <p className="modal-sub">Just the basics. Our property team will take it from here.</p>
          <div className="form-intent">
            <button className={intent === "BUY" ? "active" : ""} type="button" onClick={() => setIntent("BUY")}>I want to buy</button>
            <button className={intent === "SELL" ? "active" : ""} type="button" onClick={() => setIntent("SELL")}>I want to sell</button>
          </div>
          <form onSubmit={handleSubmit}>
            <label><span>Your name</span><input name="name" placeholder="What should we call you?" required /></label>
            <label><span>Contact number</span><input name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="10-digit mobile number" required /></label>
            <label><span>Location</span><input name="location" placeholder="e.g. Noida, Greater Noida" required /></label>
            <label><span>What are you looking for?</span><input name="lookingFor" placeholder={intent === "BUY" ? "e.g. 3 BHK / plot / commercial" : "e.g. flat / house / plot"} required /></label>
            <button className="form-submit" type="submit">Continue with JMD <ArrowUpRight size={18}/></button>
          </form>
          <small className="form-note">No account. No spam. Just a conversation when you need it.</small>
        </> : <div className="success-state">
          <div className="success-icon"><Check size={25}/></div>
          <div className="modal-kicker">YOU'RE ON OUR LIST</div>
          <h2>We've got you.<br/><em>We'll take it from here.</em></h2>
          <p>Our JMD property team will reach out shortly and help with the next step.</p>
          <button className="form-submit" onClick={closeForm}>Done <ArrowUpRight size={18}/></button>
        </div>}
      </div>
    </div>}
  </main>;
}
export default App;

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Demand Map - MediaHub",
};

export default async function PublisherDemandPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Static list of top countries with demand metric percentages
  const countryDemand = [
    { country: "United Kingdom", value: 13 },
    { country: "Canada", value: 9 },
    { country: "United Arab Emirates", value: 7.5 },
    { country: "United States", value: 7.4 },
    { country: "Singapore", value: 7 },
    { country: "Indonesia", value: 6.8 },
    { country: "Australia", value: 6.8 },
    { country: "Italy", value: 6.2 },
    { country: "Japan", value: 5.5 },
    { country: "Germany", value: 4.8 },
    { country: "South Africa", value: 3.8 },
    { country: "France", value: 3.8 },
    { country: "Republic of Korea", value: 3.5 },
    { country: "Spain", value: 3.3 },
    { country: "Netherlands", value: 2.2 },
    { country: "Poland", value: 2.1 },
    { country: "China", value: 1.8 },
    { country: "Switzerland", value: 1.6 },
    { country: "Taiwan, Province of China", value: 1.5 },
    { country: "New Zealand", value: 1.2 },
    { country: "Thailand", value: 1.2 },
    { country: "Hong Kong", value: 1.1 },
    { country: "Qatar", value: 0.8 },
    { country: "Israel", value: 0.8 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb & Title */}
      <div className="mb-6 font-inter text-xs text-muted">
        <span>Home &gt; Demand map</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-space text-dark">Demand map</h1>
      </div>

      {/* Accordion Guide Block */}
      <details open className="faq-details border-base bg-card rounded-lg mb-6" style={{ borderColor: '#E8ECFD' }}>
        <summary className="font-space font-medium p-4 cursor-pointer flex justify-between items-center list-none" style={{ backgroundColor: '#EEF0FD' }}>
          <div className="flex items-center gap-3">
            <span className="help-icon">?</span>
            <span className="text-primary font-semibold">How it works</span>
          </div>
          <ChevronRightIcon className="arrow-icon w-4 h-4 transition-transform text-primary" />
        </summary>
        <div className="p-6 border-t border-muted text-sm text-dark leading-relaxed font-inter">
          <p className="mb-3">Use this page to <strong>increase the number of orders and your income</strong>.</p>
          <p className="mb-3">You will see the current Demand for sites on the Media Partner Hub. You might track the demand for sites based on the countries and filter it by days.</p>
          <p className="mb-3">If you want to receive more tasks, we recommend <strong>adding sites to countries where the demand bar is the highest</strong>. (The bar shows the potential demand for sites based on the country basis.)</p>
          <p className="font-semibold mb-2">Let&apos;s see how it works with the following example.</p>
          <ol className="list-decimal pl-5 flex flex-col gap-2">
            <li>Take a look at the &quot;By Country&quot; graph. For example, the demand in the United States is the highest (compared to the bars of other countries).</li>
            <li>Add new sites that receive traffic from and operate in the United States.</li>
            <li>If your offer is interesting and the site is fitting (based on other metrics like DA, DR, price you state, etc.), you will get an order.</li>
          </ol>
          <p className="mt-3">Either way, adding more sites to countries with high demand palpably increases your chances of getting more tasks and income.</p>
        </div>
      </details>

      {/* Demand Map Chart Card */}
      <div className="card bg-card border-base rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-space font-semibold text-dark text-md">By Country</h3>
          <div className="flex items-center gap-2 bg-app p-1 rounded-lg">
            <button className="btn btn-outline btn-sm bg-white border-none font-semibold">180 days</button>
            <button className="btn btn-ghost btn-sm text-muted">90 days</button>
            <button className="btn btn-ghost btn-sm text-muted">30 days</button>
          </div>
        </div>

        {/* Bar chart diagram mockup */}
        <div style={{ height: '320px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '32px', position: 'relative', borderBottom: '1px solid var(--color-border)' }}>
          {countryDemand.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {/* Bar */}
              <div 
                className="w-full bg-[#3E4FEA] rounded-t hover:bg-primary-hover transition-colors"
                style={{ height: `${c.value * 7}%` }}
              >
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-dark text-white text-xs px-2 py-1 rounded transition-opacity pointer-events-none">
                  {c.value}%
                </div>
              </div>
              {/* Label */}
              <span className="absolute bottom-[-24px] text-[9px] text-muted text-center leading-tight truncate w-full font-inter" style={{ transform: 'rotate(-45deg)', transformOrigin: 'top center', whiteSpace: 'nowrap' }}>
                {c.country}
              </span>
            </div>
          ))}
        </div>

        {/* Call to action footer inside demand chart card */}
        <div className="flex justify-between items-center mt-12 bg-[#EEF0FD] p-4 rounded-lg">
          <span className="text-sm font-semibold text-primary font-space">Increase the number of tasks & income by adding sites to Countries with high demand</span>
          <Link href="/publisher/platforms/new" className="btn btn-dark btn-sm font-space font-semibold" style={{ borderRadius: '6px' }}>
            Add sites!
          </Link>
        </div>
      </div>

      <style>{`
        .help-icon {
          width: 20px;
          height: 20px;
          background: #3E4FEA;
          color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

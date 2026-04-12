export default function PersonalizedMessage({ messages, preferences }) {
  if (!messages || messages.length === 0) return null;

  return (
    <div className="bg-gradient-to-l from-brand-50 to-amber-50 rounded-2xl p-5 mb-6 animate-fade-in border border-brand-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-xl shrink-0">
          🤖
        </div>
        <div>
          <p className="font-bold text-gray-800 mb-1">שף AI מכיר אותך!</p>
          {messages.map((msg, i) => (
            <p key={i} className="text-sm text-gray-600 leading-relaxed mb-1" dangerouslySetInnerHTML={{
              __html: msg.replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-600">$1</strong>')
            }} />
          ))}

          {preferences?.topSites?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {preferences.topSites.map((site, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-xs text-gray-600 border border-gray-100">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  {site.site_name}
                  <span className="text-gray-300">({site.visit_count})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

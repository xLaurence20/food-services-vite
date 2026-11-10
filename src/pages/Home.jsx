export default function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
        <span className="inline-block bg-[#efd0ae] text-[#67330d] rounded-full px-3 py-1 text-xs font-bold mb-3">WELCOME</span>
        <h2 className="text-2xl text-[#7a3e00] font-bold mb-2">Welcome, Grade 9 Learner!</h2>
        <p className="mb-4">This prototype provides organized Food Services lessons, guided activities, digital-supported explanations, quizzes, and reflection tasks.</p>
        <div className="bg-[#fff7e8] border-l-4 border-[#d98b3a] p-4 rounded mb-4 text-sm">
          <strong>Important:</strong> Always verify information with your teacher and use the validated module content as your main learning guide.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">📚 Learn</h3><p className="text-sm">Read structured Food Services lessons.</p></div>
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">🧩 Practice</h3><p className="text-sm">Complete activities and apply what you learned.</p></div>
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">📊 Assess</h3><p className="text-sm">Check your understanding through quizzes.</p></div>
        <div className="bg-[#f6eadf] p-5 rounded-xl"><h3 className="text-[#663716] font-bold text-lg mb-1">💬 Feedback</h3><p className="text-sm">Share your experience with the module.</p></div>
      </div>
    </div>
  )
}
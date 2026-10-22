
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-emerald-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-emerald-800">বাজার দর</span>
          {" "}— প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="max-w-xl text-xs leading-5 text-gray-500">
          সকল দাম সম্ভাব্য; বাজারের অবস্থার ওপর নির্ভর করে পরিবর্তিত হতে পারে।
        </p>
      </div>

      <div className="border-t border-emerald-100 px-4 py-3 text-center text-xs text-gray-500">
© 2026 বাজার দর। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}

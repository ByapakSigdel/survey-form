export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-neutral-800 py-8 text-center text-[11px] md:text-xs text-neutral-500 space-y-2">
      <p>Hundred Studios</p>
      <p>&copy; {year} Hundred Studios. All rights reserved. ( सर्व अधिकार सुरक्षित )</p>
      <p className="text-neutral-600">Built for insight gathering. No commercial use of individual responses without consent.</p>
    </footer>
  );
}

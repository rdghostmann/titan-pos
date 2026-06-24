import Link from "next/link"

const DashboardFooter = () => {
   return (
      <>
         {/* Modern minimal footer */}
         <footer className="bg-white border-t border-slate-200 py-6" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-450 text-slate-400 font-medium">
               <div>
                  &copy; 2026 MediCareDistribute Health Network. All rights reserved.
               </div>
               <div className="flex items-center gap-4">
                  <Link href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Ordinance</Link>
                  <span>&middot;</span>
                  <Link href="#terms" className="hover:text-slate-600 transition-colors">Supplier Service Level Agreement</Link>
               </div>
            </div>
         </footer >
      </>
   )
}

export default DashboardFooter

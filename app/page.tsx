import { Header } from "@/components/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
// import { RecentReports } from "@/components/dashboard/recent-reports"
// import { DonorOffersList } from "@/components/dashboard/donor-offers-list"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AlertTriangle, CloudRain } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-4 sm:py-6">
        {/* Emergency Banner - Made responsive */}
        <div className="mb-4 sm:mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4">
          <div className="flex items-start sm:items-center gap-3">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h2 className="font-semibold text-destructive text-sm sm:text-base">
                Active Emergency: Severe Flooding Across Sri Lanka
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Multiple districts affected. Report damage or offer assistance through this portal.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section - Made responsive */}
        <div className="mb-6 sm:mb-8 rounded-2xl border border-border bg-card p-4 sm:p-8">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left">
            <div className="mb-4 md:mb-0 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl md:mr-6">
              <img
                src="/logo2.png"           // change to your logo path
                alt="Portal Logo"
                className="mb-4 md:mb-0 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl md:mr-6"
              />
            </div>
            <div>
              <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-foreground text-balance">
                RiseAgain Sri Lanka
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl">
                Coordinating emergency response efforts. Report damage to receive help or register as a donor to support
                affected communities.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics - Made heading responsive */}
        <section className="mb-6 sm:mb-8">
          <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-foreground">Response Overview</h2>
          <StatsCards />
        </section>

        {/* Main Content Grid - Stack on mobile, side-by-side on large screens */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* <RecentReports /> */}
            {/* <DonorOffersList /> */}
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}

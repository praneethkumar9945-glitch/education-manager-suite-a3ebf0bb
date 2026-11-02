import { useState } from 'react';
import { Card, CardHeader, CardBody, StatCard } from '@/components/marketing-pr/components/ui/Card';
import { PageHeader, Button, SectionTitle } from '@/components/marketing-pr/components/ui/Common';
import { BarChart, DonutChart, ProgressBar } from '@/components/marketing-pr/components/charts/Charts';
import { Drawer } from '@/components/marketing-pr/components/ui/Drawer';
import { InfoRow } from '@/components/marketing-pr/components/ui/Common';
import {
  Globe, Eye, MousePointerClick, Share2, Search, TrendingUp,
  Target,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface DetailData {
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  chart?: ReactNode;
  activities: { label: string; value: string; time: string }[];
}

export function DigitalMarketingOverview() {
  const [detailView, setDetailView] = useState<DetailData | null>(null);

  return (
    <div>
      <PageHeader title="Digital Marketing Overview" description="Monitor the performance of website, social media, SEO, and online advertising activities handled by the Digital Marketing Executive." />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        <StatCard label="Website Visitors" value="48,250" icon={<Eye size={20} />} accent="blue" change={12.5} trend="up" />
        <StatCard label="Social Media Reach" value="140K" icon={<Share2 size={20} />} accent="green" change={15.3} trend="up" />
        <StatCard label="Search Visibility" value="72%" icon={<Search size={20} />} accent="amber" change={5.4} trend="up" />
        <StatCard label="Ad Leads Generated" value="477" icon={<MousePointerClick size={20} />} accent="indigo" change={-3.2} trend="down" />
      </div>

      {/* Website Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
        <Card>
          <CardHeader
            title="Website Performance"
            subtitle="Traffic and enquiry metrics"
            icon={<Globe size={18} />}
            action={<Button size="sm" variant="ghost" onClick={() => setDetailView({
              title: 'Website Performance',
              subtitle: 'Detailed website analytics',
              stats: [
                { label: 'Total Visitors', value: '48,250' },
                { label: 'Unique Visitors', value: '32,100' },
                { label: 'Page Views', value: '145,800' },
                { label: 'Enquiries Generated', value: '342' },
                { label: 'Bounce Rate', value: '38.2%' },
                { label: 'Avg. Session Duration', value: '3m 42s' },
              ],
              chart: <BarChart data={[
                { label: 'Mon', value: 6200 },
                { label: 'Tue', value: 7100 },
                { label: 'Wed', value: 8400 },
                { label: 'Thu', value: 7800 },
                { label: 'Fri', value: 9200 },
                { label: 'Sat', value: 4800 },
                { label: 'Sun', value: 4750 },
              ]} color="bg-blue-500" />,
              activities: [
                { label: '2026 Admissions page updated', value: '28,900 views', time: '8 days ago' },
                { label: 'Open Day registration published', value: '15,600 views', time: '24 days ago' },
                { label: 'B.Tech CSE page updated', value: '12,450 views', time: '7 days ago' },
              ],
            })}>View Details</Button>}
          />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-slate-400">Visitors (30 days)</p>
                <p className="text-lg font-bold text-slate-800">48,250</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-slate-400">Enquiries Generated</p>
                <p className="text-lg font-bold text-slate-800">342</p>
              </div>
            </div>
            <ProgressBar label="Conversion Rate" value={3.2} max={10} color="bg-blue-500" />
          </CardBody>
        </Card>

        {/* Social Media Performance */}
        <Card>
          <CardHeader
            title="Social Media Performance"
            subtitle="Reach and engagement across platforms"
            icon={<Share2 size={18} />}
            action={<Button size="sm" variant="ghost" onClick={() => setDetailView({
              title: 'Social Media Performance',
              subtitle: 'Platform-wise breakdown',
              stats: [
                { label: 'Total Reach', value: '140K' },
                { label: 'Total Engagement', value: '9.8%' },
                { label: 'Followers Gained', value: '+1,240' },
                { label: 'Posts Published', value: '48' },
                { label: 'Avg. Likes per Post', value: '1,073' },
                { label: 'Avg. Comments per Post', value: '113' },
              ],
              chart: <DonutChart size={130} data={[
                { label: 'Instagram', value: 53000, color: 'bg-pink-500' },
                { label: 'Facebook', value: 60000, color: 'bg-blue-600' },
                { label: 'LinkedIn', value: 14500, color: 'bg-blue-700' },
                { label: 'Twitter', value: 12500, color: 'bg-slate-700' },
              ]} centerValue="140K" centerLabel="Reach" />,
              activities: [
                { label: 'Student achievement post', value: '18,500 reach', time: '2 days ago' },
                { label: 'Admissions open post', value: '32,000 reach', time: '4 days ago' },
                { label: 'Dean interview post', value: '14,500 reach', time: '6 days ago' },
              ],
            })}>View Details</Button>}
          />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-slate-400">Total Reach</p>
                <p className="text-lg font-bold text-slate-800">140K</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-slate-400">Engagement Rate</p>
                <p className="text-lg font-bold text-slate-800">9.8%</p>
              </div>
            </div>
            <DonutChart
              size={110}
              data={[
                { label: 'Instagram', value: 53000, color: 'bg-pink-500' },
                { label: 'Facebook', value: 60000, color: 'bg-blue-600' },
                { label: 'LinkedIn', value: 14500, color: 'bg-blue-700' },
                { label: 'Twitter', value: 12500, color: 'bg-slate-700' },
              ]}
              centerValue="140K"
              centerLabel="Reach"
            />
          </CardBody>
        </Card>
      </div>

      {/* SEO & Advertising */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
        <Card>
          <CardHeader
            title="SEO Performance"
            subtitle="Search visibility and organic traffic"
            icon={<Search size={18} />}
            action={<Button size="sm" variant="ghost" onClick={() => setDetailView({
              title: 'SEO Performance',
              subtitle: 'Search engine optimization metrics',
              stats: [
                { label: 'Search Visibility', value: '72%' },
                { label: 'Organic Traffic', value: '21,800' },
                { label: 'Keywords in Top 10', value: '7' },
                { label: 'Avg. Position', value: '4.1' },
                { label: 'Indexed Pages', value: '342' },
                { label: 'Domain Authority', value: '38' },
              ],
              chart: <BarChart data={[
                { label: 'best eng college', value: 4, color: 'bg-emerald-500' },
                { label: 'btech cse', value: 2, color: 'bg-emerald-500' },
                { label: 'mba admission', value: 6, color: 'bg-amber-500' },
                { label: 'nursing college', value: 3, color: 'bg-emerald-500' },
                { label: 'bba program', value: 8, color: 'bg-amber-500' },
              ]} />,
              activities: [
                { label: 'Keyword "best engineering college" moved to #4', value: 'from #7', time: '5 days ago' },
                { label: 'Keyword "college open day 2026" at #1', value: 'from #2', time: '1 week ago' },
                { label: 'Keyword "MBA admission open" dropped to #6', value: 'from #5', time: '1 week ago' },
              ],
            })}>View Details</Button>}
          />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-slate-400">Search Visibility</p>
                <p className="text-lg font-bold text-slate-800">72%</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-slate-400">Organic Traffic</p>
                <p className="text-lg font-bold text-slate-800">21,800</p>
              </div>
            </div>
            <ProgressBar label="Search Visibility" value={72} color="bg-amber-500" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Advertising Performance"
            subtitle="Active ad campaigns and lead generation"
            icon={<Target size={18} />}
            action={<Button size="sm" variant="ghost" onClick={() => setDetailView({
              title: 'Advertising Performance',
              subtitle: 'Online advertising metrics',
              stats: [
                { label: 'Active Ad Campaigns', value: '6' },
                { label: 'Total Ad Spend', value: '₹1,24,500' },
                { label: 'Leads Generated', value: '477' },
                { label: 'Cost per Lead', value: '₹261' },
                { label: 'Click-through Rate', value: '4.2%' },
                { label: 'Total Impressions', value: '2,84,000' },
              ],
              chart: <BarChart data={[
                { label: 'Google Ads', value: 145, color: 'bg-blue-500' },
                { label: 'Instagram', value: 92, color: 'bg-pink-500' },
                { label: 'LinkedIn', value: 67, color: 'bg-blue-700' },
                { label: 'Facebook', value: 84, color: 'bg-blue-600' },
                { label: 'YouTube', value: 51, color: 'bg-red-500' },
                { label: 'Email', value: 38, color: 'bg-amber-500' },
              ]} />,
              activities: [
                { label: 'Google Ads - 2026 Admissions', value: '145 leads', time: 'Active' },
                { label: 'Instagram - B.Tech CSE', value: '92 leads', time: 'Active' },
                { label: 'LinkedIn - MBA', value: '67 leads', time: 'Active' },
              ],
            })}>View Details</Button>}
          />
          <CardBody>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-slate-400">Active Ads</p>
                <p className="text-lg font-bold text-slate-800">6</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-slate-400">Leads Generated</p>
                <p className="text-lg font-bold text-slate-800">477</p>
              </div>
            </div>
            <ProgressBar label="Budget Utilization" value={68} color="bg-indigo-500" />
          </CardBody>
        </Card>
      </div>

      {/* Detail Drawer */}
      <Drawer
        open={!!detailView}
        onClose={() => setDetailView(null)}
        title={detailView?.title || ''}
        subtitle={detailView?.subtitle}
        footer={<Button variant="secondary" onClick={() => setDetailView(null)}>Close</Button>}
      >
        {detailView && (
          <div className="space-y-1">
            <SectionTitle title="Key Metrics" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              {detailView.stats.map((stat, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                </div>
              ))}
            </div>
            {detailView.chart && (
              <div className="mb-4">
                <SectionTitle title="Visualization" />
                <div className="p-4 bg-slate-50 rounded-lg">{detailView.chart}</div>
              </div>
            )}
            <SectionTitle title="Recent Activities" />
            <div className="space-y-2">
              {detailView.activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{act.label}</p>
                    <p className="text-xs text-slate-400">{act.value} - {act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

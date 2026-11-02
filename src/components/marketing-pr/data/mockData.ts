import type {
  Student,
  Enquiry,
  FollowUp,
  CounsellingRecord,
  Campaign,
  BrandActivity,
  PRActivity,
  DigitalCampaign,
  WebsiteContent,
  SocialPost,
  SEOKeyword,
  ContentItem,
  SocialMediaContent,
  ContentReviewItem,
  LibraryAsset,
  EventItem,
  SchoolOutreach,
  Partnership,
  OutreachLead,
  Task,
  Notification,
  DigitalKPI,
} from '@/components/marketing-pr/types';

export const students: Student[] = [
  { id: 'S001', name: 'Aarav Sharma', email: 'aarav.sharma@email.com', phone: '+91 98765 43210', courseInterest: 'B.Tech CSE', leadSource: 'Website', dateReceived: '2026-08-15', status: 'New Lead', assignedCounsellor: 'Priya Menon', interestLevel: 'High' },
  { id: 'S002', name: 'Diya Patel', email: 'diya.patel@email.com', phone: '+91 98765 43211', courseInterest: 'BBA', leadSource: 'Social Media', dateReceived: '2026-08-14', status: 'Contacted', assignedCounsellor: 'Rahul Nair', interestLevel: 'Medium', lastContact: '2026-08-20', nextFollowUp: '2026-09-09' },
  { id: 'S003', name: 'Kabir Singh', email: 'kabir.singh@email.com', phone: '+91 98765 43212', courseInterest: 'MBA', leadSource: 'Education Fair', dateReceived: '2026-08-10', status: 'Interested', assignedCounsellor: 'Priya Menon', interestLevel: 'High', lastContact: '2026-08-25', nextFollowUp: '2026-09-10' },
  { id: 'S004', name: 'Ananya Reddy', email: 'ananya.reddy@email.com', phone: '+91 98765 43213', courseInterest: 'BCA', leadSource: 'Referral', dateReceived: '2026-08-08', status: 'Follow-up', assignedCounsellor: 'Sneha Gupta', interestLevel: 'Medium', lastContact: '2026-08-28', nextFollowUp: '2026-09-08' },
  { id: 'S005', name: 'Ishaan Verma', email: 'ishaan.verma@email.com', phone: '+91 98765 43214', courseInterest: 'B.Sc Nursing', leadSource: 'Walk-in', dateReceived: '2026-08-05', status: 'Applied', assignedCounsellor: 'Rahul Nair', interestLevel: 'High', lastContact: '2026-09-01' },
  { id: 'S006', name: 'Sara Khan', email: 'sara.khan@email.com', phone: '+91 98765 43215', courseInterest: 'B.Tech CSE', leadSource: 'Website', dateReceived: '2026-08-20', status: 'New Lead', assignedCounsellor: 'Unassigned', interestLevel: 'Medium' },
  { id: 'S007', name: 'Vihaan Joshi', email: 'vihaan.joshi@email.com', phone: '+91 98765 43216', courseInterest: 'MBA', leadSource: 'Social Media', dateReceived: '2026-08-18', status: 'Contacted', assignedCounsellor: 'Sneha Gupta', interestLevel: 'High', lastContact: '2026-08-30', nextFollowUp: '2026-09-12' },
  { id: 'S008', name: 'Myra Iyer', email: 'myra.iyer@email.com', phone: '+91 98765 43217', courseInterest: 'BBA', leadSource: 'Education Fair', dateReceived: '2026-08-12', status: 'Interested', assignedCounsellor: 'Priya Menon', interestLevel: 'Medium', lastContact: '2026-08-27', nextFollowUp: '2026-09-11' },
  { id: 'S009', name: 'Arjun Das', email: 'arjun.das@email.com', phone: '+91 98765 43218', courseInterest: 'BCA', leadSource: 'Referral', dateReceived: '2026-08-03', status: 'Admitted', assignedCounsellor: 'Rahul Nair', interestLevel: 'High', lastContact: '2026-09-02' },
  { id: 'S010', name: 'Kiya Malhotra', email: 'kiya.malhotra@email.com', phone: '+91 98765 43219', courseInterest: 'B.Sc Nursing', leadSource: 'Website', dateReceived: '2026-08-22', status: 'New Lead', assignedCounsellor: 'Unassigned', interestLevel: 'Low' },
  { id: 'S011', name: 'Reyansh Pillai', email: 'reyansh.pillai@email.com', phone: '+91 98765 43220', courseInterest: 'B.Tech CSE', leadSource: 'Social Media', dateReceived: '2026-08-16', status: 'Follow-up', assignedCounsellor: 'Sneha Gupta', interestLevel: 'High', lastContact: '2026-08-29', nextFollowUp: '2026-09-09' },
  { id: 'S012', name: 'Anika Bose', email: 'anika.bose@email.com', phone: '+91 98765 43221', courseInterest: 'MBA', leadSource: 'Walk-in', dateReceived: '2026-08-06', status: 'Applied', assignedCounsellor: 'Priya Menon', interestLevel: 'Medium', lastContact: '2026-08-31' },
];

export const enquiries: Enquiry[] = [
  { id: 'E001', studentName: 'Aarav Sharma', category: 'Courses', subject: 'B.Tech CSE specializations available', date: '2026-08-15', status: 'Open', assignedCounsellor: 'Priya Menon' },
  { id: 'E002', studentName: 'Diya Patel', category: 'Fees', subject: 'BBA fee structure and installment options', date: '2026-08-14', status: 'Responded', assignedCounsellor: 'Rahul Nair', lastResponse: '2026-08-19' },
  { id: 'E003', studentName: 'Kabir Singh', category: 'Eligibility', subject: 'MBA admission eligibility criteria', date: '2026-08-10', status: 'Responded', assignedCounsellor: 'Priya Menon', lastResponse: '2026-08-12' },
  { id: 'E004', studentName: 'Ananya Reddy', category: 'Admissions', subject: 'BCA admission deadline and process', date: '2026-08-08', status: 'Open', assignedCounsellor: 'Sneha Gupta' },
  { id: 'E005', studentName: 'Ishaan Verma', category: 'Courses', subject: 'B.Sc Nursing clinical training details', date: '2026-08-05', status: 'Closed', assignedCounsellor: 'Rahul Nair', lastResponse: '2026-08-10' },
  { id: 'E006', studentName: 'Sara Khan', category: 'Fees', subject: 'Scholarship options for B.Tech CSE', date: '2026-08-20', status: 'Open', assignedCounsellor: 'Unassigned' },
  { id: 'E007', studentName: 'Vihaan Joshi', category: 'Eligibility', subject: 'MBA entrance exam requirements', date: '2026-08-18', status: 'Responded', assignedCounsellor: 'Sneha Gupta', lastResponse: '2026-08-22' },
  { id: 'E008', studentName: 'Myra Iyer', category: 'Other', subject: 'Hostel accommodation for BBA students', date: '2026-08-12', status: 'Open', assignedCounsellor: 'Priya Menon' },
];

export const followUps: FollowUp[] = [
  { id: 'F001', studentName: 'Diya Patel', courseInterest: 'BBA', assignedCounsellor: 'Rahul Nair', lastContact: '2026-08-20', nextFollowUp: '2026-09-09', status: 'Due' },
  { id: 'F002', studentName: 'Kabir Singh', courseInterest: 'MBA', assignedCounsellor: 'Priya Menon', lastContact: '2026-08-25', nextFollowUp: '2026-09-10', status: 'Scheduled' },
  { id: 'F003', studentName: 'Ananya Reddy', courseInterest: 'BCA', assignedCounsellor: 'Sneha Gupta', lastContact: '2026-08-28', nextFollowUp: '2026-09-08', status: 'Overdue' },
  { id: 'F004', studentName: 'Vihaan Joshi', courseInterest: 'MBA', assignedCounsellor: 'Sneha Gupta', lastContact: '2026-08-30', nextFollowUp: '2026-09-12', status: 'Scheduled' },
  { id: 'F005', studentName: 'Myra Iyer', courseInterest: 'BBA', assignedCounsellor: 'Priya Menon', lastContact: '2026-08-27', nextFollowUp: '2026-09-11', status: 'Due' },
  { id: 'F006', studentName: 'Reyansh Pillai', courseInterest: 'B.Tech CSE', assignedCounsellor: 'Sneha Gupta', lastContact: '2026-08-29', nextFollowUp: '2026-09-09', status: 'Due' },
  { id: 'F007', studentName: 'Ishaan Verma', courseInterest: 'B.Sc Nursing', assignedCounsellor: 'Rahul Nair', lastContact: '2026-09-01', nextFollowUp: '2026-09-07', status: 'Completed' },
];

export const counsellingRecords: CounsellingRecord[] = [
  { id: 'C001', studentName: 'Kabir Singh', course: 'MBA', counsellor: 'Priya Menon', date: '2026-08-25', interestLevel: 'High', status: 'Completed', nextStep: 'Schedule campus visit', notes: 'Interested in finance specialization' },
  { id: 'C002', studentName: 'Diya Patel', course: 'BBA', counsellor: 'Rahul Nair', date: '2026-08-20', interestLevel: 'Medium', status: 'Completed', nextStep: 'Send fee structure', notes: 'Comparing with two other colleges' },
  { id: 'C003', studentName: 'Myra Iyer', course: 'BBA', counsellor: 'Priya Menon', date: '2026-09-05', interestLevel: 'Medium', status: 'Scheduled', nextStep: 'Career guidance session' },
  { id: 'C004', studentName: 'Vihaan Joshi', course: 'MBA', counsellor: 'Sneha Gupta', date: '2026-09-03', interestLevel: 'High', status: 'Completed', nextStep: 'Connect with alumni', notes: 'Strong interest in entrepreneurship track' },
  { id: 'C005', studentName: 'Anika Bose', course: 'MBA', counsellor: 'Priya Menon', date: '2026-09-06', interestLevel: 'Medium', status: 'Scheduled', nextStep: 'Discuss scholarship options' },
  { id: 'C006', studentName: 'Reyansh Pillai', course: 'B.Tech CSE', counsellor: 'Sneha Gupta', date: '2026-08-29', interestLevel: 'High', status: 'Completed', nextStep: 'Application assistance', notes: 'Interested in AI/ML electives' },
];

export const campaigns: Campaign[] = [
  { id: 'CMP001', name: '2026 Admissions Campaign', objective: 'Drive admissions for 2026 academic year', targetAudience: 'Class 12 Students & Parents', startDate: '2026-07-01', endDate: '2026-12-31', channel: 'Multi-Channel', status: 'Active', performance: 78, reach: 145000, engagement: 12, leadsGenerated: 342, reviewed: true },
  { id: 'CMP002', name: 'Undergraduate Awareness Campaign', objective: 'Increase awareness of UG programs', targetAudience: 'High School Students', startDate: '2026-06-15', endDate: '2026-10-15', channel: 'Digital + Print', status: 'Active', performance: 65, reach: 89000, engagement: 8, leadsGenerated: 198, reviewed: false },
  { id: 'CMP003', name: 'MBA Admissions Promotion', objective: 'Promote MBA program and admissions', targetAudience: 'Working Professionals', startDate: '2026-08-01', endDate: '2026-11-30', channel: 'LinkedIn + Digital', status: 'Under Review', performance: 72, reach: 56000, engagement: 15, leadsGenerated: 124, reviewed: false },
  { id: 'CMP004', name: 'Open Day Promotion', objective: 'Promote campus open day event', targetAudience: 'Prospective Students & Parents', startDate: '2026-08-10', endDate: '2026-09-15', channel: 'Social Media + Email', status: 'Active', performance: 85, reach: 42000, engagement: 18, leadsGenerated: 156, reviewed: true },
  { id: 'CMP005', name: 'Nursing Program Awareness', objective: 'Promote B.Sc Nursing program', targetAudience: 'Science Students', startDate: '2026-05-01', endDate: '2026-08-31', channel: 'Digital', status: 'Completed', performance: 68, reach: 38000, engagement: 7, leadsGenerated: 89, reviewed: true },
  { id: 'CMP006', name: 'Alumni Success Stories Campaign', objective: 'Showcase alumni achievements', targetAudience: 'General Public', startDate: '2026-07-15', endDate: '2026-10-15', channel: 'Social Media', status: 'On Hold', performance: 0, reach: 25000, engagement: 0, leadsGenerated: 0, reviewed: false },
];

export const brandActivities: BrandActivity[] = [
  { id: 'B001', activity: 'Student achievement coverage in City Daily', source: 'News Media', date: '2026-09-05', sentiment: 'Positive', status: 'Published', details: 'Aarav Sharma won national coding competition. Article published in City Daily with college mention.' },
  { id: 'B002', activity: 'College annual event feedback review', source: 'Social Media', date: '2026-09-03', sentiment: 'Positive', status: 'Monitored', details: 'Overwhelmingly positive feedback on annual cultural fest. 340+ positive mentions across platforms.' },
  { id: 'B003', activity: 'Parent feedback review on Google', source: 'Google Reviews', date: '2026-09-01', sentiment: 'Positive', status: 'Monitored', details: '4.6/5 average rating from 89 parent reviews. Praise for faculty quality and campus facilities.' },
  { id: 'B004', activity: 'Negative public comment on social media', source: 'Twitter', date: '2026-08-28', sentiment: 'Negative', status: 'Needs Attention', details: 'Complaint about admission process delay. Requires PR response and process review.' },
  { id: 'B005', activity: 'Institutional branding material review', source: 'Internal', date: '2026-08-25', sentiment: 'Neutral', status: 'Under Review', details: 'New prospectus design under review. Brand consistency check in progress.' },
  { id: 'B006', activity: 'Education portal ranking feature', source: 'Education Portal', date: '2026-08-20', sentiment: 'Positive', status: 'Published', details: 'College ranked #7 in regional engineering colleges by Education Portal.' },
];

export const prActivities: PRActivity[] = [
  { id: 'PR001', activity: 'College achievement press release', type: 'Press Release', date: '2026-09-05', status: 'Completed', assignedTo: 'PR / Media Team', details: 'Press release distributed to 12 media outlets covering national coding competition win.' },
  { id: 'PR002', activity: 'Annual awards announcement', type: 'Announcement', date: '2026-09-02', status: 'In Progress', assignedTo: 'PR / Media Team', details: 'Annual academic and sports awards announcement being prepared for media distribution.' },
  { id: 'PR003', activity: 'Leadership interview request', type: 'Media Interview', date: '2026-08-28', status: 'Pending', assignedTo: 'Marketing Head / PRO', details: 'City Daily requested interview with Dean regarding new program launches.' },
  { id: 'PR004', activity: 'College event media coverage', type: 'Media Coverage', date: '2026-08-25', status: 'Completed', assignedTo: 'PR / Media Team', details: 'Media coverage arranged for annual cultural fest. 3 newspapers and 2 TV channels covered the event.' },
  { id: 'PR005', activity: 'Institutional announcement - new programs', type: 'Announcement', date: '2026-08-20', status: 'Under Review', assignedTo: 'Marketing Head / PRO', details: 'Announcement of 3 new certificate programs pending review before media release.' },
  { id: 'PR006', activity: 'Community outreach feature', type: 'Media Coverage', date: '2026-08-15', status: 'Needs Attention', assignedTo: 'PR / Media Team', details: 'Local newspaper interested in featuring community outreach program. Response overdue.' },
];

export const digitalCampaigns: DigitalCampaign[] = [
  { id: 'DC001', name: '2026 Admissions - Google Ads', channel: 'Google Ads', startDate: '2026-07-01', endDate: '2026-12-31', status: 'Active', reach: 95000, engagement: 6.2, leadsGenerated: 145 },
  { id: 'DC002', name: 'B.Tech CSE - Instagram Campaign', channel: 'Instagram', startDate: '2026-07-15', endDate: '2026-10-15', status: 'Active', reach: 62000, engagement: 8.5, leadsGenerated: 92 },
  { id: 'DC003', name: 'MBA - LinkedIn Sponsored', channel: 'LinkedIn', startDate: '2026-08-01', endDate: '2026-11-30', status: 'Active', reach: 38000, engagement: 5.1, leadsGenerated: 67 },
  { id: 'DC004', name: 'Open Day - Facebook Event Promo', channel: 'Facebook', startDate: '2026-08-10', endDate: '2026-09-15', status: 'Active', reach: 28000, engagement: 9.2, leadsGenerated: 84 },
  { id: 'DC005', name: 'Nursing Program - YouTube Ads', channel: 'YouTube', startDate: '2026-05-01', endDate: '2026-08-31', status: 'Completed', reach: 45000, engagement: 4.8, leadsGenerated: 51 },
  { id: 'DC006', name: 'Campus Tour - Email Campaign', channel: 'Email', startDate: '2026-08-15', endDate: '2026-09-30', status: 'Active', reach: 12000, engagement: 12.5, leadsGenerated: 38 },
];

export const websiteContents: WebsiteContent[] = [
  { id: 'W001', title: 'B.Tech CSE Program Page Update', type: 'Courses', status: 'Published', lastUpdated: '2026-09-01', url: '/programs/btech-cse', views: 12450 },
  { id: 'W002', title: '2026 Admissions Open Announcement', type: 'Admissions', status: 'Published', lastUpdated: '2026-08-28', url: '/admissions/2026', views: 28900 },
  { id: 'W003', title: 'Annual Cultural Fest Event Page', type: 'Events', status: 'Published', lastUpdated: '2026-08-20', url: '/events/cultural-fest-2026', views: 8700 },
  { id: 'W004', title: 'New Certificate Programs Announcement', type: 'Announcements', status: 'Under Review', lastUpdated: '2026-08-25', url: '/announcements/new-programs', views: 0 },
  { id: 'W005', title: 'MBA Program Brochure Page', type: 'Courses', status: 'Draft', lastUpdated: '2026-09-03', url: '/programs/mba', views: 0 },
  { id: 'W006', title: 'Open Day Registration Page', type: 'Events', status: 'Published', lastUpdated: '2026-08-15', url: '/events/open-day-2026', views: 15600 },
  { id: 'W007', title: 'B.Sc Nursing Curriculum Update', type: 'Courses', status: 'Under Review', lastUpdated: '2026-08-30', url: '/programs/bsc-nursing', views: 0 },
];

export const socialPosts: SocialPost[] = [
  { id: 'SP001', platform: 'Instagram', content: 'Meet our national coding champion Aarav Sharma! 🎉 #ProudMoment', date: '2026-09-06', reach: 18500, engagement: 14.2, likes: 1240, comments: 89, shares: 156 },
  { id: 'SP002', platform: 'Facebook', content: '2026 Admissions are now open! Apply today and join our vibrant campus.', date: '2026-09-04', reach: 32000, engagement: 7.8, likes: 890, comments: 145, shares: 320 },
  { id: 'SP003', platform: 'LinkedIn', content: 'Our Dean shares insights on the future of engineering education.', date: '2026-09-02', reach: 14500, engagement: 9.5, likes: 670, comments: 92, shares: 180 },
  { id: 'SP004', platform: 'Instagram', content: 'Campus tour Thursday! Swipe to see our state-of-the-art labs.', date: '2026-08-30', reach: 22000, engagement: 11.3, likes: 1450, comments: 78, shares: 95 },
  { id: 'SP005', platform: 'Twitter', content: 'Ranked #7 in regional engineering colleges! Thank you to our faculty and students.', date: '2026-08-25', reach: 12500, engagement: 8.9, likes: 520, comments: 45, shares: 210 },
  { id: 'SP006', platform: 'Facebook', content: 'Annual Cultural Fest 2026 - A celebration of talent and diversity!', date: '2026-08-22', reach: 28000, engagement: 13.1, likes: 1670, comments: 230, shares: 410 },
];

export const seoKeywords: SEOKeyword[] = [
  { id: 'K001', keyword: 'best engineering college', rank: 4, previousRank: 7, searchVolume: 18000, trend: 'up' },
  { id: 'K002', keyword: 'B.Tech CSE admission 2026', rank: 2, previousRank: 3, searchVolume: 12000, trend: 'up' },
  { id: 'K003', keyword: 'MBA admission open', rank: 6, previousRank: 5, searchVolume: 9500, trend: 'down' },
  { id: 'K004', keyword: 'B.Sc Nursing college', rank: 3, previousRank: 3, searchVolume: 7200, trend: 'stable' },
  { id: 'K005', keyword: 'BBA program admission', rank: 8, previousRank: 11, searchVolume: 6800, trend: 'up' },
  { id: 'K006', keyword: 'BCA course details', rank: 5, previousRank: 4, searchVolume: 5400, trend: 'down' },
  { id: 'K007', keyword: 'college open day 2026', rank: 1, previousRank: 2, searchVolume: 4200, trend: 'up' },
];

export const contentItems: ContentItem[] = [
  { id: 'CI001', title: 'National Coding Champion Post', type: 'Social Media Post', status: 'Published', createdBy: 'Content Team', date: '2026-09-06', content: 'Instagram post celebrating student achievement with photo and caption.' },
  { id: 'CI002', title: '2026 Admissions Landing Page Copy', type: 'Website Content', status: 'Approved', createdBy: 'Content Team', date: '2026-09-03', content: 'Website copy for 2026 admissions landing page with program highlights and CTA.' },
  { id: 'CI003', title: 'September Newsletter', type: 'Newsletter', status: 'In Review', createdBy: 'Content Team', date: '2026-09-05', content: 'Monthly newsletter featuring campus updates, student achievements, and admission reminders.' },
  { id: 'CI004', title: 'MBA Program Brochure Copy', type: 'Campaign Material', status: 'Draft', createdBy: 'Content Team', date: '2026-09-04', content: 'Promotional copy for MBA program brochure highlighting curriculum and career outcomes.' },
  { id: 'CI005', title: 'Open Day Social Media Series', type: 'Social Media Post', status: 'Approved', createdBy: 'Content Team', date: '2026-08-28', content: 'Series of 5 social media posts promoting campus open day event.' },
  { id: 'CI006', title: 'Alumni Success Story - Class of 2024', type: 'Website Content', status: 'Draft', createdBy: 'Content Team', date: '2026-09-02', content: 'Feature article on successful alumni and their career journeys.' },
];

export const socialMediaContents: SocialMediaContent[] = [
  { id: 'SM001', title: 'Student Achievement - Coding Champion', platform: 'Instagram', topic: 'Achievements', status: 'Published', date: '2026-09-06', createdBy: 'Content Team' },
  { id: 'SM002', title: 'B.Tech CSE Program Highlight', platform: 'Facebook', topic: 'Programs', status: 'Published', date: '2026-09-01', createdBy: 'Content Team' },
  { id: 'SM003', title: 'Annual Cultural Fest Recap', platform: 'Instagram', topic: 'Events', status: 'Published', date: '2026-08-23', createdBy: 'Content Team' },
  { id: 'SM004', title: 'New Certificate Programs Launch', platform: 'LinkedIn', topic: 'Institutional Updates', status: 'In Review', date: '2026-09-04', createdBy: 'Content Team' },
  { id: 'SM005', title: 'Faculty Excellence Award Post', platform: 'Facebook', topic: 'Achievements', status: 'Approved', date: '2026-08-28', createdBy: 'Content Team' },
  { id: 'SM006', title: 'Campus Infrastructure Tour', platform: 'Instagram', topic: 'Programs', status: 'Draft', date: '2026-09-05', createdBy: 'Content Team' },
];

export const contentReviewItems: ContentReviewItem[] = [
  { id: 'CR001', title: 'September Newsletter', type: 'Newsletter', createdBy: 'Content Team', date: '2026-09-05', status: 'Pending Review', reviewer: 'Marketing Head / PRO', content: 'Monthly newsletter featuring campus updates, student achievements, and admission reminders for September 2026.' },
  { id: 'CR002', title: 'MBA Program Brochure Copy', type: 'Campaign Material', createdBy: 'Content Team', date: '2026-09-04', status: 'Pending Review', reviewer: 'Marketing Head / PRO', content: 'Promotional copy for MBA program brochure highlighting curriculum, faculty, and career outcomes.' },
  { id: 'CR003', title: 'New Certificate Programs Post', type: 'Social Media Post', createdBy: 'Content Team', date: '2026-09-04', status: 'Pending Review', reviewer: 'Marketing Head / PRO', content: 'LinkedIn post announcing 3 new certificate programs in AI, Data Science, and Digital Marketing.' },
  { id: 'CR004', title: 'Alumni Success Story Article', type: 'Website Content', createdBy: 'Content Team', date: '2026-09-02', status: 'Changes Requested', reviewer: 'Marketing Head / PRO', content: 'Feature article on alumni from Class of 2024. Reviewer requested updated quotes and additional photos.' },
  { id: 'CR005', title: 'Open Day Social Media Series', type: 'Social Media Post', createdBy: 'Content Team', date: '2026-08-28', status: 'Approved', reviewer: 'Marketing Head / PRO', content: 'Series of 5 social media posts promoting campus open day event across platforms.' },
  { id: 'CR006', title: 'Campus Infrastructure Tour Reel', type: 'Social Media Post', createdBy: 'Content Team', date: '2026-09-05', status: 'Pending Review', reviewer: 'Marketing Head / PRO', content: 'Instagram reel showcasing campus facilities including labs, library, and sports complex.' },
];

export const libraryAssets: LibraryAsset[] = [
  { id: 'LA001', name: 'College Logo - High Res', type: 'Image', category: 'Brand Assets', uploadDate: '2026-01-15', uploadedBy: 'Content Team', size: '2.1 MB' },
  { id: 'LA002', name: 'Campus Aerial Video', type: 'Video', category: 'Campus', uploadDate: '2026-03-20', uploadedBy: 'Content Team', size: '145 MB' },
  { id: 'LA003', name: '2026 Prospectus - Final', type: 'Brochure', category: 'Admissions', uploadDate: '2026-08-15', uploadedBy: 'Content Team', size: '12.4 MB' },
  { id: 'LA004', name: 'Social Media Post Template', type: 'Template', category: 'Templates', uploadDate: '2026-02-10', uploadedBy: 'Content Team', size: '0.8 MB' },
  { id: 'LA005', name: 'Student Achievement Graphic', type: 'Graphic', category: 'Achievements', uploadDate: '2026-09-05', uploadedBy: 'Content Team', size: '1.2 MB' },
  { id: 'LA006', name: 'Open Day Poster Design', type: 'Image', category: 'Events', uploadDate: '2026-08-05', uploadedBy: 'Content Team', size: '2.8 MB' },
  { id: 'LA007', name: 'MBA Brochure Template', type: 'Template', category: 'Templates', uploadDate: '2026-04-12', uploadedBy: 'Content Team', size: '1.5 MB' },
  { id: 'LA008', name: 'Campus Lab Tour Video', type: 'Video', category: 'Campus', uploadDate: '2026-05-18', uploadedBy: 'Content Team', size: '89 MB' },
  { id: 'LA009', name: 'Brand Color Palette Guide', type: 'Image', category: 'Brand Assets', uploadDate: '2026-01-10', uploadedBy: 'Content Team', size: '0.5 MB' },
  { id: 'LA010', name: 'Faculty Profile Template', type: 'Template', category: 'Templates', uploadDate: '2026-03-05', uploadedBy: 'Content Team', size: '0.9 MB' },
];

export const events: EventItem[] = [
  { id: 'EV001', name: 'Regional Education Fair 2026', type: 'Education Fair', date: '2026-09-20', location: 'City Convention Center', coordinator: 'Events Team', participants: 1200, status: 'Confirmed', leadsGenerated: 0, description: 'Participating in regional education fair with booth and presentation. Expected to generate 200+ leads.' },
  { id: 'EV002', name: 'Engineering Career Seminar', type: 'Seminar', date: '2026-09-15', location: 'Main Auditorium', coordinator: 'Events Team', participants: 350, status: 'Confirmed', leadsGenerated: 0, description: 'Career guidance seminar for prospective engineering students featuring industry speakers.' },
  { id: 'EV003', name: 'Campus Open Day', type: 'Open Day', date: '2026-09-12', location: 'College Campus', coordinator: 'Events Team', participants: 800, status: 'Confirmed', leadsGenerated: 0, description: 'Open day with campus tours, faculty interactions, and program presentations for prospective students and parents.' },
  { id: 'EV004', name: 'AI & ML Workshop', type: 'Workshop', date: '2026-08-28', location: 'CS Lab Block', coordinator: 'Events Team', participants: 120, status: 'Completed', leadsGenerated: 45, description: 'Hands-on workshop on AI and ML for interested students. Generated strong leads for B.Tech CSE.' },
  { id: 'EV005', name: 'MBA Information Session', type: 'Seminar', date: '2026-08-22', location: 'Business Block', coordinator: 'Events Team', participants: 180, status: 'Completed', leadsGenerated: 62, description: 'Information session for prospective MBA students with faculty Q&A and alumni panel.' },
  { id: 'EV006', name: 'Nursing Career Awareness Drive', type: 'Workshop', date: '2026-10-05', location: 'Science Block', coordinator: 'Events Team', participants: 200, status: 'Planning', leadsGenerated: 0, description: 'Awareness drive for B.Sc Nursing program with clinical demonstration and career guidance.' },
];

export const schoolOutreach: SchoolOutreach[] = [
  { id: 'SO001', institution: 'Delhi Public School', activity: 'Career Guidance Session', date: '2026-09-18', contactPerson: 'Mr. Rajesh Kumar', contactPhone: '+91 98765 11111', status: 'Scheduled', leadsGenerated: 0 },
  { id: 'SO002', institution: 'St. Xavier School', activity: 'Program Presentation', date: '2026-09-14', contactPerson: 'Ms. Catherine Dsouza', contactPhone: '+91 98765 22222', status: 'Scheduled', leadsGenerated: 0 },
  { id: 'SO003', institution: 'Govt. Senior Secondary School', activity: 'Admission Awareness Drive', date: '2026-08-30', contactPerson: 'Mr. Suresh Sharma', contactPhone: '+91 98765 33333', status: 'Completed', leadsGenerated: 38 },
  { id: 'SO004', institution: 'Kendriya Vidyalaya', activity: 'Campus Tour Invitation', date: '2026-09-25', contactPerson: 'Mrs. Lakshmi Iyer', contactPhone: '+91 98765 44444', status: 'Pending', leadsGenerated: 0 },
  { id: 'SO005', institution: 'Modern Public School', activity: 'Science Exhibition Visit', date: '2026-08-26', contactPerson: 'Mr. Pradeep Singh', contactPhone: '+91 98765 55555', status: 'Completed', leadsGenerated: 24 },
  { id: 'SO006', institution: 'DAV School', activity: 'Career Counseling Workshop', date: '2026-10-02', contactPerson: 'Mrs. Sunita Agarwal', contactPhone: '+91 98765 66666', status: 'Scheduled', leadsGenerated: 0 },
];

export const partnerships: Partnership[] = [
  { id: 'PT001', organization: 'Delhi Public School', type: 'School', contactPerson: 'Mr. Rajesh Kumar', email: 'principal@dps.edu', phone: '+91 98765 11111', status: 'Active', collaboration: 'Annual career guidance sessions', date: '2025-06-01' },
  { id: 'PT002', organization: 'City University', type: 'College', contactPerson: 'Dr. Anil Mehta', email: 'anil.mehta@cityuni.edu', phone: '+91 98765 77777', status: 'Active', collaboration: 'Joint research and exchange programs', date: '2024-09-15' },
  { id: 'PT003', organization: 'Community Youth Forum', type: 'Community Group', contactPerson: 'Mr. Vivek Rao', email: 'vivek@cyf.org', phone: '+91 98765 88888', status: 'Active', collaboration: 'Community outreach and skill development', date: '2025-01-20' },
  { id: 'PT004', organization: 'TechEd Solutions', type: 'External Organization', contactPerson: 'Ms. Kavya Reddy', email: 'kavya@teched.com', phone: '+91 98765 99999', status: 'Proposed', collaboration: 'Industry-academia partnership for workshops', date: '2026-08-15' },
  { id: 'PT005', organization: 'St. Xavier School', type: 'School', contactPerson: 'Ms. Catherine Dsouza', email: 'principal@saintxavier.edu', phone: '+91 98765 22222', status: 'Active', collaboration: 'Student referral and campus tours', date: '2025-03-10' },
  { id: 'PT006', organization: 'Global Education Trust', type: 'External Organization', contactPerson: 'Mr. Arnav Khanna', email: 'arnav@getrust.org', phone: '+91 98765 10101', status: 'On Hold', collaboration: 'Scholarship program for underprivileged students', date: '2025-11-05' },
];

export const outreachLeads: OutreachLead[] = [
  { id: 'OL001', studentName: 'Rohan Mehta', source: 'AI & ML Workshop', courseInterest: 'B.Tech CSE', date: '2026-08-28', status: 'New Lead', followUpAssigned: 'Priya Menon' },
  { id: 'OL002', studentName: 'Nisha Agarwal', source: 'AI & ML Workshop', courseInterest: 'B.Tech CSE', date: '2026-08-28', status: 'Contacted', followUpAssigned: 'Sneha Gupta' },
  { id: 'OL003', studentName: 'Karan Malhotra', source: 'MBA Information Session', courseInterest: 'MBA', date: '2026-08-22', status: 'Interested', followUpAssigned: 'Priya Menon' },
  { id: 'OL004', studentName: 'Pooja Nair', source: 'Govt. School Awareness Drive', courseInterest: 'BCA', date: '2026-08-30', status: 'New Lead', followUpAssigned: 'Rahul Nair' },
  { id: 'OL005', studentName: 'Aditya Rao', source: 'MBA Information Session', courseInterest: 'MBA', date: '2026-08-22', status: 'Follow-up', followUpAssigned: 'Sneha Gupta' },
  { id: 'OL006', studentName: 'Tanvi Shah', source: 'Modern Public School Visit', courseInterest: 'BBA', date: '2026-08-26', status: 'New Lead', followUpAssigned: 'Priya Menon' },
  { id: 'OL007', studentName: 'Siddharth Roy', source: 'Govt. School Awareness Drive', courseInterest: 'B.Sc Nursing', date: '2026-08-30', status: 'Applied', followUpAssigned: 'Rahul Nair' },
  { id: 'OL008', studentName: 'Riya Kapoor', source: 'Modern Public School Visit', courseInterest: 'B.Tech CSE', date: '2026-08-26', status: 'Contacted', followUpAssigned: 'Sneha Gupta' },
];

export const tasks: Task[] = [
  { id: 'T001', title: 'Create BCA Admission Promotional Poster', description: 'Design an eye-catching promotional poster for BCA Admissions 2026 covering program highlights, career outcomes and the application deadline. Deliver print and social media sizes.', assignedTeam: 'Content / Brand Team', priority: 'High', dueDate: '2026-09-24', status: 'In Progress', createdBy: 'Marketing Head / PRO', createdAt: '2026-09-08', relatedTo: '2026 Admissions Campaign', additionalInstructions: 'Use official college brand colours and fonts. Include the admission helpline number and a QR code linking to the application page.', progress: 45, comments: [{ id: 'C001', author: 'Marketing Head / PRO', role: 'head', message: 'Please share a draft by Friday so we can review before printing.', timestamp: '2026-09-09 10:15' }, { id: 'C002', author: 'Content / Brand Team', role: 'team', message: 'Two concepts are ready — drafts will be uploaded tomorrow for feedback.', timestamp: '2026-09-10 15:40' }], attachments: [], activity: [{ id: 'A001', author: 'Marketing Head / PRO', message: 'Task assigned to Content / Brand Team. Awaiting team to start work.', timestamp: '2026-09-08 09:30' }, { id: 'A002', author: 'Content / Brand Team', message: 'Task started by team. Work in progress.', timestamp: '2026-09-09 11:00' }, { id: 'A003', author: 'Content / Brand Team', message: 'Progress updated to 45%', timestamp: '2026-09-12 16:20' }] },
  { id: 'T002', title: 'Launch BCA Admission Digital Campaign', description: 'Plan and launch the BCA admission digital campaign across Google Search and Instagram. Set up targeting, creatives, budget split and lead tracking.', assignedTeam: 'Digital Marketing Executive', priority: 'High', dueDate: '2026-09-20', status: 'Submitted for Review', createdBy: 'Marketing Head / PRO', createdAt: '2026-09-05', relatedTo: '2026 Admissions Campaign', additionalInstructions: 'Target Class 12 students and parents within a 100km radius. Share the campaign summary once live.', progress: 100, submittedAt: '2026-09-17 16:45', comments: [{ id: 'C003', author: 'Digital Marketing Executive', role: 'team', message: 'Campaign is live. Summary report and creatives attached for your review.', timestamp: '2026-09-17 16:46' }], attachments: [{ id: 'F001', name: 'bca-campaign-summary.pdf', fileType: 'PDF', size: '1.2 MB', uploadedBy: 'Digital Marketing Executive', uploadedAt: '2026-09-17 16:40' }, { id: 'F002', name: 'ad-creatives-pack.zip', fileType: 'ZIP', size: '8.4 MB', uploadedBy: 'Digital Marketing Executive', uploadedAt: '2026-09-17 16:42' }], activity: [{ id: 'A004', author: 'Marketing Head / PRO', message: 'Task assigned to Digital Marketing Executive. Awaiting team to start work.', timestamp: '2026-09-05 10:00' }, { id: 'A005', author: 'Digital Marketing Executive', message: 'Task started by team. Work in progress.', timestamp: '2026-09-08 09:20' }, { id: 'A006', author: 'Digital Marketing Executive', message: 'Uploaded material: bca-campaign-summary.pdf, ad-creatives-pack.zip', timestamp: '2026-09-17 16:42' }, { id: 'A007', author: 'Digital Marketing Executive', message: 'Work completed and submitted for review.', timestamp: '2026-09-17 16:45' }] },
  { id: 'T004', title: 'Organize BCA Open Day', description: 'Plan and organise an on-campus Open Day for prospective BCA students and parents — venue, agenda, lab tours, faculty interaction and registration desk.', assignedTeam: 'Events & Outreach Coordinator', priority: 'Medium', dueDate: '2026-10-05', status: 'Assigned', createdBy: 'Marketing Head / PRO', createdAt: '2026-09-15', relatedTo: '2026 Admissions Campaign', additionalInstructions: 'Coordinate with Content team for posters and the Digital team for the registration page. Share the run sheet for approval.', progress: 0, comments: [], attachments: [], activity: [{ id: 'A011', author: 'Marketing Head / PRO', message: 'Task assigned to Events & Outreach Coordinator. Awaiting team to start work.', timestamp: '2026-09-15 11:30' }] },
  { id: 'T005', title: 'Create social media content for Open Day', description: 'Prepare 5 social media posts promoting the campus Open Day across Instagram, Facebook and LinkedIn. Include event highlights and a registration CTA.', assignedTeam: 'Content / Brand Team', priority: 'High', dueDate: '2026-09-26', status: 'In Progress', createdBy: 'Marketing Head / PRO', createdAt: '2026-09-12', progress: 30, comments: [], attachments: [], activity: [{ id: 'A012', author: 'Marketing Head / PRO', message: 'Task assigned to Content / Brand Team. Awaiting team to start work.', timestamp: '2026-09-12 09:45' }, { id: 'A013', author: 'Content / Brand Team', message: 'Task started by team. Work in progress.', timestamp: '2026-09-13 10:00' }, { id: 'A014', author: 'Content / Brand Team', message: 'Progress updated to 30%', timestamp: '2026-09-15 14:10' }] },
  { id: 'T006', title: 'Launch Google Ads for 2026 Admissions', description: 'Set up and launch Google Ads targeting keywords related to 2026 admissions, focusing on B.Tech CSE and MBA programs.', assignedTeam: 'Digital Marketing Executive', priority: 'High', dueDate: '2026-09-25', status: 'Changes Requested', createdBy: 'Marketing Head / PRO', createdAt: '2026-09-02', progress: 85, submittedAt: '2026-09-15 14:20', reviewComments: 'Please add competitor names to the negative keyword list and increase the daily budget cap for the B.Tech ad group. Update the keyword report and resubmit.', comments: [], attachments: [{ id: 'F003', name: 'google-ads-keyword-report.xlsx', fileType: 'XLSX', size: '84 KB', uploadedBy: 'Digital Marketing Executive', uploadedAt: '2026-09-15 14:15' }], activity: [{ id: 'A015', author: 'Marketing Head / PRO', message: 'Task assigned to Digital Marketing Executive. Awaiting team to start work.', timestamp: '2026-09-02 10:30' }, { id: 'A016', author: 'Digital Marketing Executive', message: 'Work completed and submitted for review.', timestamp: '2026-09-15 14:20' }, { id: 'A017', author: 'Marketing Head / PRO', message: 'Changes requested. Task sent back to the team for revision.', timestamp: '2026-09-16 09:10' }] },
  { id: 'T007', title: 'Coordinate school visit to DPS', description: 'Plan and coordinate a career guidance session at Delhi Public School. Prepare the presentation and promotional material for students.', assignedTeam: 'Events & Outreach Coordinator', priority: 'Medium', dueDate: '2026-09-28', status: 'Assigned', createdBy: 'Marketing Head / PRO', createdAt: '2026-09-14', relatedTo: 'Engineering Career Seminar', progress: 0, comments: [], attachments: [], activity: [{ id: 'A018', author: 'Marketing Head / PRO', message: 'Task assigned to Events & Outreach Coordinator. Awaiting team to start work.', timestamp: '2026-09-14 12:00' }] },
  { id: 'T008', title: 'Update website with 2026 admission details', description: 'Update the admissions page with 2026 dates, eligibility criteria and the application process. Ensure SEO optimisation.', assignedTeam: 'Digital Marketing Executive', priority: 'Medium', dueDate: '2026-09-15', status: 'Completed', createdBy: 'Marketing Head / PRO', createdAt: '2026-08-20', progress: 100, submittedAt: '2026-09-13 17:05', completedAt: '2026-09-14 10:30', reviewComments: 'Well executed — verified the eligibility table and application steps. Approved.', comments: [], attachments: [{ id: 'F004', name: 'admission-page-updated.png', fileType: 'PNG', size: '640 KB', uploadedBy: 'Digital Marketing Executive', uploadedAt: '2026-09-13 17:00' }], activity: [{ id: 'A019', author: 'Digital Marketing Executive', message: 'Work completed and submitted for review.', timestamp: '2026-09-13 17:05' }, { id: 'A020', author: 'Marketing Head / PRO', message: 'Work approved. Review comments: "Well executed — verified the eligibility table and application steps. Approved." Task completed.', timestamp: '2026-09-14 10:30' }] },
  { id: 'T009', title: 'Design Open Day promotional poster', description: 'Create a visually appealing poster for the campus Open Day including date, time, location and registration QR code.', assignedTeam: 'Content / Brand Team', priority: 'Medium', dueDate: '2026-09-05', status: 'Completed', createdBy: 'Marketing Head / PRO', createdAt: '2026-08-25', progress: 100, submittedAt: '2026-09-03 18:00', completedAt: '2026-09-04 12:00', reviewComments: 'Great work. Approved for print and digital use.', comments: [], attachments: [{ id: 'F005', name: 'open-day-poster-final.png', fileType: 'PNG', size: '2.1 MB', uploadedBy: 'Content / Brand Team', uploadedAt: '2026-09-03 17:55' }], activity: [{ id: 'A021', author: 'Content / Brand Team', message: 'Work completed and submitted for review.', timestamp: '2026-09-03 18:00' }, { id: 'A022', author: 'Marketing Head / PRO', message: 'Work approved. Review comments: "Great work. Approved for print and digital use." Task completed.', timestamp: '2026-09-04 12:00' }] },
  { id: 'T010', title: 'Prepare press release for new programs', description: 'Draft a press release announcing the 3 new certificate programs and coordinate distribution with media contacts.', assignedTeam: 'Content / Brand Team', priority: 'High', dueDate: '2026-09-21', status: 'In Progress', createdBy: 'Marketing Head / PRO', createdAt: '2026-08-28', additionalInstructions: 'Share the draft with my office before sending it to any media house.', progress: 70, comments: [], attachments: [], activity: [{ id: 'A023', author: 'Marketing Head / PRO', message: 'Task assigned to Content / Brand Team. Awaiting team to start work.', timestamp: '2026-08-28 09:15' }, { id: 'A024', author: 'Content / Brand Team', message: 'Task started by team. Work in progress.', timestamp: '2026-08-29 10:05' }, { id: 'A025', author: 'Content / Brand Team', message: 'Progress updated to 70%', timestamp: '2026-09-14 15:45' }] },
];

export const notifications: Notification[] = [
  { id: 'N001', type: 'task', title: 'New Task Assigned', message: 'Task "Create social media content for Open Day" assigned to Content / Brand Team', time: '2 hours ago', read: false, role: 'content' },
  { id: 'N002', type: 'task', title: 'Task Submitted for Review', message: 'Task "Launch Google Ads for 2026 Admissions" submitted for review', time: '5 hours ago', read: false, role: 'marketing-head' },
  { id: 'N003', type: 'content', title: 'Content Requires Approval', message: 'September Newsletter is pending review', time: '1 day ago', read: false, role: 'marketing-head' },
  { id: 'N004', type: 'media', title: 'Media Item Requires Attention', message: 'Community outreach feature response is overdue', time: '1 day ago', read: false, role: 'marketing-head' },
  { id: 'N005', type: 'campaign', title: 'Campaign Requires Review', message: 'MBA Admissions Promotion campaign is pending review', time: '2 days ago', read: true, role: 'marketing-head' },
  { id: 'N008', type: 'event', title: 'Event Lead Generated', message: '3 new leads from AI & ML Workshop', time: '1 day ago', read: true, role: 'events' },
  { id: 'N009', type: 'pr', title: 'PR Item Needs Attention', message: 'Leadership interview request from City Daily pending', time: '2 days ago', read: true, role: 'marketing-head' },
  { id: 'N010', type: 'task', title: 'Task Completed', message: 'Task "Update website with 2026 admission details" marked as completed', time: '3 days ago', read: true, role: 'marketing-head' },
];

export const digitalKPIs: DigitalKPI[] = [
  { label: 'Website Visitors', value: '48,250', change: 12.5, trend: 'up' },
  { label: 'Enquiries Generated', value: '342', change: 8.2, trend: 'up' },
  { label: 'Social Media Reach', value: '133,500', change: 15.3, trend: 'up' },
  { label: 'Social Engagement Rate', value: '9.8%', change: 2.1, trend: 'up' },
  { label: 'Search Visibility', value: '72%', change: 5.4, trend: 'up' },
  { label: 'Organic Traffic', value: '21,800', change: 8.7, trend: 'up' },
  { label: 'Active Ad Campaigns', value: '6', change: 0, trend: 'stable' },
  { label: 'Ad Leads Generated', value: '477', change: -3.2, trend: 'down' },
];

export const courses = ['B.Tech CSE', 'BBA', 'BCA', 'MBA', 'B.Sc Nursing'];
export const leadSources = ['Website', 'Social Media', 'Education Fair', 'Referral', 'Walk-in'];
export const counsellors = ['Priya Menon', 'Rahul Nair', 'Sneha Gupta'];

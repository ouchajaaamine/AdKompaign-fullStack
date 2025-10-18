<?php

namespace App\DataFixtures;

use App\Entity\Affiliate;
use App\Entity\Campaign;
use App\Entity\Metric;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Create Campaigns with business-focused data
        $campaign1 = new Campaign();
        $campaign1->setName('Electronics & Gadgets Launch');
        $campaign1->setBudget(5000.00);
        $campaign1->setStartDate(new \DateTimeImmutable('2025-06-01'));
        $campaign1->setEndDate(new \DateTimeImmutable('2025-08-31'));
        $campaign1->setStatus('active');
        $manager->persist($campaign1);

        $campaign2 = new Campaign();
        $campaign2->setName('Winter Apparel Collection');
        $campaign2->setBudget(3000.00);
        $campaign2->setStartDate(new \DateTimeImmutable('2025-12-01'));
        $campaign2->setEndDate(new \DateTimeImmutable('2025-12-31'));
        $campaign2->setStatus('draft');
        $manager->persist($campaign2);

        $campaign3 = new Campaign();
        $campaign3->setName('Academic Resources Platform');
        $campaign3->setBudget(7500.00);
        $campaign3->setStartDate(new \DateTimeImmutable('2025-08-15'));
        $campaign3->setEndDate(new \DateTimeImmutable('2025-09-15'));
        $campaign3->setStatus('active');
        $manager->persist($campaign3);

        $campaign4 = new Campaign();
        $campaign4->setName('Fashion Brand Relaunch');
        $campaign4->setBudget(12000.00);
        $campaign4->setStartDate(new \DateTimeImmutable('2025-03-01'));
        $campaign4->setEndDate(new \DateTimeImmutable('2025-05-31'));
        $campaign4->setStatus('completed');
        $manager->persist($campaign4);

        $campaign5 = new Campaign();
        $campaign5->setName('Home Improvement Tools');
        $campaign5->setBudget(8500.00);
        $campaign5->setStartDate(new \DateTimeImmutable('2025-04-01'));
        $campaign5->setEndDate(new \DateTimeImmutable('2025-06-30'));
        $campaign5->setStatus('active');
        $manager->persist($campaign5);

        $campaign6 = new Campaign();
        $campaign6->setName('Health & Fitness App');
        $campaign6->setBudget(6200.00);
        $campaign6->setStartDate(new \DateTimeImmutable('2025-01-15'));
        $campaign6->setEndDate(new \DateTimeImmutable('2025-03-15'));
        $campaign6->setStatus('completed');
        $manager->persist($campaign6);

        // Additional Campaigns for more comprehensive data
        $campaign7 = new Campaign();
        $campaign7->setName('E-commerce Platform Sale');
        $campaign7->setBudget(25000.00);
        $campaign7->setStartDate(new \DateTimeImmutable('2025-11-20'));
        $campaign7->setEndDate(new \DateTimeImmutable('2025-11-30'));
        $campaign7->setStatus('draft');
        $manager->persist($campaign7);

        $campaign8 = new Campaign();
        $campaign8->setName('Digital Services Bundle');
        $campaign8->setBudget(18000.00);
        $campaign8->setStartDate(new \DateTimeImmutable('2025-12-01'));
        $campaign8->setEndDate(new \DateTimeImmutable('2025-12-02'));
        $campaign8->setStatus('draft');
        $manager->persist($campaign8);

        $campaign9 = new Campaign();
        $campaign9->setName('Premium Beauty Products');
        $campaign9->setBudget(4500.00);
        $campaign9->setStartDate(new \DateTimeImmutable('2025-02-01'));
        $campaign9->setEndDate(new \DateTimeImmutable('2025-02-14'));
        $campaign9->setStatus('completed');
        $manager->persist($campaign9);

        $campaign10 = new Campaign();
        $campaign10->setName('Family Entertainment Package');
        $campaign10->setBudget(3200.00);
        $campaign10->setStartDate(new \DateTimeImmutable('2025-03-20'));
        $campaign10->setEndDate(new \DateTimeImmutable('2025-04-20'));
        $campaign10->setStatus('completed');
        $manager->persist($campaign10);

        $campaign11 = new Campaign();
        $campaign11->setName('Professional Development Courses');
        $campaign11->setBudget(5500.00);
        $campaign11->setStartDate(new \DateTimeImmutable('2025-05-01'));
        $campaign11->setEndDate(new \DateTimeImmutable('2025-05-12'));
        $campaign11->setStatus('active');
        $manager->persist($campaign11);

        $campaign12 = new Campaign();
        $campaign12->setName('Technology Solutions Suite');
        $campaign12->setBudget(4800.00);
        $campaign12->setStartDate(new \DateTimeImmutable('2025-06-01'));
        $campaign12->setEndDate(new \DateTimeImmutable('2025-06-16'));
        $campaign12->setStatus('active');
        $manager->persist($campaign12);

        $campaign13 = new Campaign();
        $campaign13->setName('Outdoor Adventure Gear');
        $campaign13->setBudget(3800.00);
        $campaign13->setStartDate(new \DateTimeImmutable('2025-06-20'));
        $campaign13->setEndDate(new \DateTimeImmutable('2025-07-04'));
        $campaign13->setStatus('active');
        $manager->persist($campaign13);

        $campaign14 = new Campaign();
        $campaign14->setName('Creative Arts Supplies');
        $campaign14->setBudget(2900.00);
        $campaign14->setStartDate(new \DateTimeImmutable('2025-10-15'));
        $campaign14->setEndDate(new \DateTimeImmutable('2025-10-31'));
        $campaign14->setStatus('active');
        $manager->persist($campaign14);

        $campaign15 = new Campaign();
        $campaign15->setName('Gourmet Food Delivery');
        $campaign15->setBudget(4100.00);
        $campaign15->setStartDate(new \DateTimeImmutable('2025-11-15'));
        $campaign15->setEndDate(new \DateTimeImmutable('2025-11-28'));
        $campaign15->setStatus('draft');
        $manager->persist($campaign15);

        // Create Affiliates with business-focused partnerships
        $affiliate1 = new Affiliate();
        $affiliate1->setName('Tech Review Network');
        $affiliate1->setEmail('contact@techreviewnetwork.com');
        $affiliate1->addCampaign($campaign1);
        $affiliate1->addCampaign($campaign3);
        $manager->persist($affiliate1);

        $affiliate2 = new Affiliate();
        $affiliate2->setName('Fashion Industry Blog');
        $affiliate2->setEmail('partnerships@fashionindustryblog.com');
        $affiliate2->addCampaign($campaign2);
        $affiliate2->addCampaign($campaign4);
        $manager->persist($affiliate2);

        $affiliate3 = new Affiliate();
        $affiliate3->setName('Home Improvement Hub');
        $affiliate3->setEmail('collaborate@homeimprovementhub.com');
        $affiliate3->addCampaign($campaign5);
        $manager->persist($affiliate3);

        $affiliate4 = new Affiliate();
        $affiliate4->setName('Education Technology Partners');
        $affiliate4->setEmail('deals@edtechpartners.net');
        $affiliate4->addCampaign($campaign3);
        $affiliate4->addCampaign($campaign1);
        $manager->persist($affiliate4);

        $affiliate5 = new Affiliate();
        $affiliate5->setName('Health & Wellness Network');
        $affiliate5->setEmail('affiliates@healthwellnessnetwork.com');
        $affiliate5->addCampaign($campaign6);
        $affiliate5->addCampaign($campaign5);
        $manager->persist($affiliate5);

        $affiliate6 = new Affiliate();
        $affiliate6->setName('Digital Commerce Alliance');
        $affiliate6->setEmail('marketing@digitalcommercealliance.com');
        $affiliate6->addCampaign($campaign1);
        $affiliate6->addCampaign($campaign2);
        $affiliate6->addCampaign($campaign4);
        $manager->persist($affiliate6);

        $affiliate7 = new Affiliate();
        $affiliate7->setName('Business Solutions Group');
        $affiliate7->setEmail('partners@businesssolutionsgroup.com');
        $affiliate7->addCampaign($campaign3);
        $affiliate7->addCampaign($campaign5);
        $affiliate7->addCampaign($campaign6);
        $manager->persist($affiliate7);

        $affiliate8 = new Affiliate();
        $affiliate8->setName('Lifestyle & Technology');
        $affiliate8->setEmail('business@lifestyletechnology.com');
        $affiliate8->addCampaign($campaign4);
        $affiliate8->addCampaign($campaign6);
        $manager->persist($affiliate8);

        // Additional Affiliates for more comprehensive partnerships
        $affiliate9 = new Affiliate();
        $affiliate9->setName('E-commerce Solutions Pro');
        $affiliate9->setEmail('deals@ecommercesolutionspro.com');
        $affiliate9->addCampaign($campaign2);
        $affiliate9->addCampaign($campaign7);
        $affiliate9->addCampaign($campaign8);
        $affiliate9->addCampaign($campaign15);
        $manager->persist($affiliate9);

        $affiliate10 = new Affiliate();
        $affiliate10->setName('Beauty & Lifestyle Magazine');
        $affiliate10->setEmail('partnerships@beautylifestylemag.com');
        $affiliate10->addCampaign($campaign9);
        $manager->persist($affiliate10);

        $affiliate11 = new Affiliate();
        $affiliate11->setName('Family & Entertainment Network');
        $affiliate11->setEmail('affiliates@familyentertainmentnetwork.com');
        $affiliate11->addCampaign($campaign10);
        $affiliate11->addCampaign($campaign11);
        $affiliate11->addCampaign($campaign12);
        $manager->persist($affiliate11);

        $affiliate12 = new Affiliate();
        $affiliate12->setName('Tech Solutions Review');
        $affiliate12->setEmail('sponsorships@techsolutionsreview.com');
        $affiliate12->addCampaign($campaign1);
        $affiliate12->addCampaign($campaign12);
        $manager->persist($affiliate12);

        $affiliate13 = new Affiliate();
        $affiliate13->setName('Adventure & Outdoor Hub');
        $affiliate13->setEmail('collaborate@adventureoutdoorhub.com');
        $affiliate13->addCampaign($campaign5);
        $affiliate13->addCampaign($campaign13);
        $manager->persist($affiliate13);

        $affiliate14 = new Affiliate();
        $affiliate14->setName('Creative Arts Community');
        $affiliate14->setEmail('business@creativeartscommunity.com');
        $affiliate14->addCampaign($campaign14);
        $manager->persist($affiliate14);

        $affiliate15 = new Affiliate();
        $affiliate15->setName('Gourmet Dining Network');
        $affiliate15->setEmail('partnerships@gourmetdiningnetwork.com');
        $affiliate15->addCampaign($campaign15);
        $affiliate15->addCampaign($campaign10);
        $manager->persist($affiliate15);

        $affiliate16 = new Affiliate();
        $affiliate16->setName('Professional Development Institute');
        $affiliate16->setEmail('advertising@professionaldevelopmentinst.com');
        $affiliate16->addCampaign($campaign6);
        $affiliate16->addCampaign($campaign9);
        $affiliate16->addCampaign($campaign11);
        $manager->persist($affiliate16);

        // Create comprehensive Metrics for each campaign with realistic data
        // Campaign 1 Metrics (Electronics & Gadgets Launch)
        $metric1 = new Metric();
        $metric1->setName('Product Launch Traffic');
        $metric1->setValue('2850.00');
        $metric1->setClicks(2850);
        $metric1->setConversions(57);
        $metric1->setRevenue('2850.00');
        $metric1->setNotes('Initial product launch website visits');
        $metric1->setTimestamp(new \DateTimeImmutable('2025-06-02'));
        $metric1->setCampaign($campaign1);
        $manager->persist($metric1);

        $metric2 = new Metric();
        $metric2->setName('Device Sales');
        $metric2->setValue('420.00');
        $metric2->setClicks(1890);
        $metric2->setConversions(38);
        $metric2->setRevenue('420.00');
        $metric2->setNotes('Electronic device purchases from campaign');
        $metric2->setTimestamp(new \DateTimeImmutable('2025-06-20'));
        $metric2->setCampaign($campaign1);
        $manager->persist($metric2);

        $metric3 = new Metric();
        $metric3->setName('Gadget Revenue');
        $metric3->setValue('18750.00');
        $metric3->setClicks(6200);
        $metric3->setConversions(145);
        $metric3->setRevenue('18750.00');
        $metric3->setNotes('Total revenue from electronics and gadgets');
        $metric3->setTimestamp(new \DateTimeImmutable('2025-06-25'));
        $metric3->setCampaign($campaign1);
        $manager->persist($metric3);

        $metric4 = new Metric();
        $metric4->setName('Tech Reviews');
        $metric4->setValue('125.00');
        $metric4->setNotes('Product reviews and testimonials shared');
        $metric4->setTimestamp(new \DateTimeImmutable('2025-07-01'));
        $metric4->setCampaign($campaign1);
        $manager->persist($metric4);

        // Campaign 2 Metrics (Winter Apparel Collection)
        $metric5 = new Metric();
        $metric5->setName('Seasonal Catalog Views');
        $metric5->setValue('3450.00');
        $metric5->setNotes('Winter clothing catalog page views');
        $metric5->setTimestamp(new \DateTimeImmutable('2025-12-05'));
        $metric5->setCampaign($campaign2);
        $manager->persist($metric5);

        $metric6 = new Metric();
        $metric6->setName('Conversion Analytics');
        $metric6->setValue('18.75');
        $metric6->setNotes('Percentage of visitors who made purchases');
        $metric6->setTimestamp(new \DateTimeImmutable('2025-12-10'));
        $metric6->setCampaign($campaign2);
        $manager->persist($metric6);

        $metric7 = new Metric();
        $metric7->setName('Winter Collection Sales');
        $metric7->setValue('2400.00');
        $metric7->setNotes('Revenue from winter apparel and accessories');
        $metric7->setTimestamp(new \DateTimeImmutable('2025-12-20'));
        $metric7->setCampaign($campaign2);
        $manager->persist($metric7);

        // Campaign 3 Metrics (Academic Resources Platform)
        $metric8 = new Metric();
        $metric8->setName('Student Account Creations');
        $metric8->setValue('675.00');
        $metric8->setNotes('New student accounts registered');
        $metric8->setTimestamp(new \DateTimeImmutable('2025-08-20'));
        $metric8->setCampaign($campaign3);
        $manager->persist($metric8);

        $metric9 = new Metric();
        $metric9->setName('Resource Downloads');
        $metric9->setValue('480.00');
        $metric9->setNotes('Educational materials downloaded');
        $metric9->setTimestamp(new \DateTimeImmutable('2025-08-25'));
        $metric9->setCampaign($campaign3);
        $manager->persist($metric9);

        $metric10 = new Metric();
        $metric10->setName('Academic Inquiries');
        $metric10->setValue('270.00');
        $metric10->setNotes('Contact forms from educational institutions');
        $metric10->setTimestamp(new \DateTimeImmutable('2025-09-01'));
        $metric10->setCampaign($campaign3);
        $manager->persist($metric10);

        $metric10a = new Metric();
        $metric10a->setName('Education Platform Revenue');
        $metric10a->setValue('14200.00');
        $metric10a->setNotes('Revenue from subscriptions and resource sales');
        $metric10a->setTimestamp(new \DateTimeImmutable('2025-09-10'));
        $metric10a->setCampaign($campaign3);
        $manager->persist($metric10a);

        // Campaign 4 Metrics (Fashion Brand Relaunch)
        $metric11 = new Metric();
        $metric11->setName('Brand Awareness Coverage');
        $metric11->setValue('95.00');
        $metric11->setNotes('Media mentions and brand coverage');
        $metric11->setTimestamp(new \DateTimeImmutable('2025-03-15'));
        $metric11->setCampaign($campaign4);
        $manager->persist($metric11);

        $metric12 = new Metric();
        $metric12->setName('Fashion Collection Revenue');
        $metric12->setValue('31200.00');
        $metric12->setNotes('Sales from relaunched fashion line');
        $metric12->setTimestamp(new \DateTimeImmutable('2025-04-01'));
        $metric12->setCampaign($campaign4);
        $manager->persist($metric12);

        $metric13 = new Metric();
        $metric13->setName('Social Media Growth');
        $metric13->setValue('1850.00');
        $metric13->setNotes('New followers from brand relaunch campaign');
        $metric13->setTimestamp(new \DateTimeImmutable('2025-04-15'));
        $metric13->setCampaign($campaign4);
        $manager->persist($metric13);

        // Campaign 5 Metrics (Home Improvement Tools)
        $metric14 = new Metric();
        $metric14->setName('Tool Sales Performance');
        $metric14->setValue('435.00');
        $metric14->setNotes('Power tools and equipment purchases');
        $metric14->setTimestamp(new \DateTimeImmutable('2025-04-10'));
        $metric14->setCampaign($campaign5);
        $manager->persist($metric14);

        $metric15 = new Metric();
        $metric15->setName('DIY Project Leads');
        $metric15->setValue('234.00');
        $metric15->setNotes('Contact forms from homeowners');
        $metric15->setTimestamp(new \DateTimeImmutable('2025-05-01'));
        $metric15->setCampaign($campaign5);
        $manager->persist($metric15);

        $metric16 = new Metric();
        $metric16->setName('Workshop Registrations');
        $metric16->setValue('127.50');
        $metric16->setNotes('Signups for home improvement training');
        $metric16->setTimestamp(new \DateTimeImmutable('2025-05-15'));
        $metric16->setCampaign($campaign5);
        $manager->persist($metric16);

        $metric16a = new Metric();
        $metric16a->setName('Home Improvement Revenue');
        $metric16a->setValue('16800.00');
        $metric16a->setNotes('Revenue from tools, materials, and services');
        $metric16a->setTimestamp(new \DateTimeImmutable('2025-06-01'));
        $metric16a->setCampaign($campaign5);
        $manager->persist($metric16a);

        // Campaign 6 Metrics (Health & Fitness App)
        $metric17 = new Metric();
        $metric17->setName('App Subscriptions');
        $metric17->setValue('510.00');
        $metric17->setNotes('New premium app subscriptions');
        $metric17->setTimestamp(new \DateTimeImmutable('2025-01-20'));
        $metric17->setCampaign($campaign6);
        $manager->persist($metric17);

        $metric18 = new Metric();
        $metric18->setName('Mobile App Downloads');
        $metric18->setValue('1875.00');
        $metric18->setNotes('App store installations');
        $metric18->setTimestamp(new \DateTimeImmutable('2025-02-01'));
        $metric18->setCampaign($campaign6);
        $manager->persist($metric18);

        $metric19 = new Metric();
        $metric19->setName('Fitness Consultations');
        $metric19->setValue('142.50');
        $metric19->setNotes('Booked personal training sessions');
        $metric19->setTimestamp(new \DateTimeImmutable('2025-02-15'));
        $metric19->setCampaign($campaign6);
        $manager->persist($metric19);

        $metric20 = new Metric();
        $metric20->setName('Nutrition Program Sales');
        $metric20->setValue('270.00');
        $metric20->setNotes('Custom diet plan purchases');
        $metric20->setTimestamp(new \DateTimeImmutable('2025-03-01'));
        $metric20->setCampaign($campaign6);
        $manager->persist($metric20);

        $metric20a = new Metric();
        $metric20a->setName('Fitness Platform Revenue');
        $metric20a->setValue('12750.00');
        $metric20a->setNotes('Revenue from subscriptions and services');
        $metric20a->setTimestamp(new \DateTimeImmutable('2025-03-10'));
        $metric20a->setCampaign($campaign6);
        $manager->persist($metric20a);

        // Campaign 7 Metrics (E-commerce Platform Sale)
        $metric21 = new Metric();
        $metric21->setName('Platform Traffic Surge');
        $metric21->setValue('7500.00');
        $metric21->setNotes('Website visitors during promotional period');
        $metric21->setTimestamp(new \DateTimeImmutable('2025-11-25'));
        $metric21->setCampaign($campaign7);
        $manager->persist($metric21);

        $metric22 = new Metric();
        $metric22->setName('Sales Volume Metrics');
        $metric22->setValue('1875.00');
        $metric22->setNotes('Total units sold during promotion');
        $metric22->setTimestamp(new \DateTimeImmutable('2025-11-29'));
        $metric22->setCampaign($campaign7);
        $manager->persist($metric22);

        $metric23 = new Metric();
        $metric23->setName('E-commerce Revenue');
        $metric23->setValue('20000.00');
        $metric23->setNotes('Total revenue from platform sales');
        $metric23->setTimestamp(new \DateTimeImmutable('2025-11-30'));
        $metric23->setCampaign($campaign7);
        $manager->persist($metric23);

        // Campaign 8 Metrics (Digital Services Bundle)
        $metric24 = new Metric();
        $metric24->setName('Service Page Visits');
        $metric24->setValue('4800.00');
        $metric24->setNotes('Digital service landing page views');
        $metric24->setTimestamp(new \DateTimeImmutable('2025-12-01'));
        $metric24->setCampaign($campaign8);
        $manager->persist($metric24);

        $metric25 = new Metric();
        $metric25->setName('Service Subscriptions');
        $metric25->setValue('1335.00');
        $metric25->setNotes('Digital service packages sold');
        $metric25->setTimestamp(new \DateTimeImmutable('2025-12-02'));
        $metric25->setCampaign($campaign8);
        $manager->persist($metric25);

        $metric26 = new Metric();
        $metric26->setName('Digital Services Revenue');
        $metric26->setValue('15000.00');
        $metric26->setNotes('Revenue from digital products and subscriptions');
        $metric26->setTimestamp(new \DateTimeImmutable('2025-12-03'));
        $metric26->setCampaign($campaign8);
        $manager->persist($metric26);

        // Campaign 9 Metrics (Premium Beauty Products)
        $metric27 = new Metric();
        $metric27->setName('Beauty Product Views');
        $metric27->setValue('2700.00');
        $metric27->setNotes('Premium beauty product page views');
        $metric27->setTimestamp(new \DateTimeImmutable('2025-02-05'));
        $metric27->setCampaign($campaign9);
        $manager->persist($metric27);

        $metric28 = new Metric();
        $metric28->setName('Luxury Beauty Sales');
        $metric28->setValue('630.00');
        $metric28->setNotes('Units sold from premium beauty line');
        $metric28->setTimestamp(new \DateTimeImmutable('2025-02-14'));
        $metric28->setCampaign($campaign9);
        $manager->persist($metric28);

        $metric29 = new Metric();
        $metric29->setName('Beauty Campaign Revenue');
        $metric29->setValue('5500.00');
        $metric29->setNotes('Revenue from premium beauty products');
        $metric29->setTimestamp(new \DateTimeImmutable('2025-02-15'));
        $metric29->setCampaign($campaign9);
        $manager->persist($metric29);

        // Campaign 10 Metrics (Family Entertainment Package)
        $metric30 = new Metric();
        $metric30->setName('Entertainment Signups');
        $metric30->setValue('975.00');
        $metric30->setNotes('Family entertainment package subscriptions');
        $metric30->setTimestamp(new \DateTimeImmutable('2025-03-25'));
        $metric30->setCampaign($campaign10);
        $manager->persist($metric30);

        $metric31 = new Metric();
        $metric31->setName('Media Package Sales');
        $metric31->setValue('570.00');
        $metric31->setNotes('Entertainment bundles and subscriptions');
        $metric31->setTimestamp(new \DateTimeImmutable('2025-04-10'));
        $metric31->setCampaign($campaign10);
        $manager->persist($metric31);

        $metric32 = new Metric();
        $metric32->setName('Entertainment Revenue');
        $metric32->setValue('3800.00');
        $metric32->setNotes('Revenue from family entertainment packages');
        $metric32->setTimestamp(new \DateTimeImmutable('2025-04-20'));
        $metric32->setCampaign($campaign10);
        $manager->persist($metric32);

        // Campaign 11 Metrics (Professional Development Courses)
        $metric33 = new Metric();
        $metric33->setName('Course Catalog Views');
        $metric33->setValue('3150.00');
        $metric33->setNotes('Professional development course listings viewed');
        $metric33->setTimestamp(new \DateTimeImmutable('2025-05-05'));
        $metric33->setCampaign($campaign11);
        $manager->persist($metric33);

        $metric34 = new Metric();
        $metric34->setName('Course Enrollments');
        $metric34->setValue('435.00');
        $metric34->setNotes('Students enrolled in professional courses');
        $metric34->setTimestamp(new \DateTimeImmutable('2025-05-10'));
        $metric34->setCampaign($campaign11);
        $manager->persist($metric34);

        $metric35 = new Metric();
        $metric35->setName('Education Revenue');
        $metric35->setValue('13800.00');
        $metric35->setNotes('Revenue from professional development courses');
        $metric35->setTimestamp(new \DateTimeImmutable('2025-05-12'));
        $metric35->setCampaign($campaign11);
        $manager->persist($metric35);

        // Campaign 12 Metrics (Technology Solutions Suite)
        $metric36 = new Metric();
        $metric36->setName('Tech Solution Searches');
        $metric36->setValue('2400.00');
        $metric36->setNotes('Searches for technology solutions');
        $metric36->setTimestamp(new \DateTimeImmutable('2025-06-08'));
        $metric36->setCampaign($campaign12);
        $manager->persist($metric36);

        $metric37 = new Metric();
        $metric37->setName('Solution Sales');
        $metric37->setValue('510.00');
        $metric37->setNotes('Technology solution packages sold');
        $metric37->setTimestamp(new \DateTimeImmutable('2025-06-15'));
        $metric37->setCampaign($campaign12);
        $manager->persist($metric37);

        $metric38 = new Metric();
        $metric38->setName('Tech Solutions Revenue');
        $metric38->setValue('11700.00');
        $metric38->setNotes('Revenue from technology solution sales');
        $metric38->setTimestamp(new \DateTimeImmutable('2025-06-16'));
        $metric38->setCampaign($campaign12);
        $manager->persist($metric38);

        // Campaign 13 Metrics (Outdoor Adventure Gear)
        $metric39 = new Metric();
        $metric39->setName('Adventure Gear Views');
        $metric39->setValue('1800.00');
        $metric39->setNotes('Outdoor equipment and gear page views');
        $metric39->setTimestamp(new \DateTimeImmutable('2025-06-25'));
        $metric39->setCampaign($campaign13);
        $manager->persist($metric39);

        $metric40 = new Metric();
        $metric40->setName('Equipment Sales');
        $metric40->setValue('420.00');
        $metric40->setNotes('Outdoor adventure gear sold');
        $metric40->setTimestamp(new \DateTimeImmutable('2025-07-02'));
        $metric40->setCampaign($campaign13);
        $manager->persist($metric40);

        $metric41 = new Metric();
        $metric41->setName('Adventure Gear Revenue');
        $metric41->setValue('9600.00');
        $metric41->setNotes('Revenue from outdoor adventure products');
        $metric41->setTimestamp(new \DateTimeImmutable('2025-07-04'));
        $metric41->setCampaign($campaign13);
        $manager->persist($metric41);

        // Campaign 14 Metrics (Creative Arts Supplies)
        $metric42 = new Metric();
        $metric42->setName('Art Supply Searches');
        $metric42->setValue('1425.00');
        $metric42->setNotes('Creative arts supplies and materials searches');
        $metric42->setTimestamp(new \DateTimeImmutable('2025-10-20'));
        $metric42->setCampaign($campaign14);
        $manager->persist($metric42);

        $metric43 = new Metric();
        $metric43->setName('Art Material Orders');
        $metric43->setValue('630.00');
        $metric43->setNotes('Art supplies and creative materials ordered');
        $metric43->setTimestamp(new \DateTimeImmutable('2025-10-28'));
        $metric43->setCampaign($campaign14);
        $manager->persist($metric43);

        $metric44 = new Metric();
        $metric44->setName('Creative Arts Revenue');
        $metric44->setValue('2500.00');
        $metric44->setNotes('Revenue from art supplies and materials');
        $metric44->setTimestamp(new \DateTimeImmutable('2025-10-31'));
        $metric44->setCampaign($campaign14);
        $manager->persist($metric44);

        // Campaign 15 Metrics (Gourmet Food Delivery)
        $metric45 = new Metric();
        $metric45->setName('Recipe Content Views');
        $metric45->setValue('2700.00');
        $metric45->setNotes('Gourmet recipe and meal planning content');
        $metric45->setTimestamp(new \DateTimeImmutable('2025-11-18'));
        $metric45->setCampaign($campaign15);
        $manager->persist($metric45);

        $metric46 = new Metric();
        $metric46->setName('Meal Kit Orders');
        $metric46->setValue('525.00');
        $metric46->setNotes('Gourmet meal delivery packages sold');
        $metric46->setTimestamp(new \DateTimeImmutable('2025-11-25'));
        $metric46->setCampaign($campaign15);
        $manager->persist($metric46);

        $metric47 = new Metric();
        $metric47->setName('Food Delivery Revenue');
        $metric47->setValue('3500.00');
        $metric47->setNotes('Revenue from gourmet food delivery services');
        $metric47->setTimestamp(new \DateTimeImmutable('2025-11-28'));
        $metric47->setCampaign($campaign15);
        $manager->persist($metric47);

        $manager->flush();
    }
}

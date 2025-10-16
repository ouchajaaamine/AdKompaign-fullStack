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
        // Create Campaigns with more realistic data
        $campaign1 = new Campaign();
        $campaign1->setName('Summer Sale Campaign - Electronics & Gadgets');
        $campaign1->setBudget(5000.00);
        $campaign1->setStartDate(new \DateTimeImmutable('2025-06-01'));
        $campaign1->setEndDate(new \DateTimeImmutable('2025-08-31'));
        $campaign1->setStatus('active');
        $manager->persist($campaign1);

        $campaign2 = new Campaign();
        $campaign2->setName('Holiday Promotion - Winter Collection');
        $campaign2->setBudget(3000.00);
        $campaign2->setStartDate(new \DateTimeImmutable('2025-12-01'));
        $campaign2->setEndDate(new \DateTimeImmutable('2025-12-31'));
        $campaign2->setStatus('draft');
        $manager->persist($campaign2);

        $campaign3 = new Campaign();
        $campaign3->setName('Back-to-School Academic Supplies');
        $campaign3->setBudget(7500.00);
        $campaign3->setStartDate(new \DateTimeImmutable('2025-08-15'));
        $campaign3->setEndDate(new \DateTimeImmutable('2025-09-15'));
        $campaign3->setStatus('active');
        $manager->persist($campaign3);

        $campaign4 = new Campaign();
        $campaign4->setName('Spring Fashion Collection 2025');
        $campaign4->setBudget(12000.00);
        $campaign4->setStartDate(new \DateTimeImmutable('2025-03-01'));
        $campaign4->setEndDate(new \DateTimeImmutable('2025-05-31'));
        $campaign4->setStatus('completed');
        $manager->persist($campaign4);

        $campaign5 = new Campaign();
        $campaign5->setName('Home & Garden Improvement');
        $campaign5->setBudget(8500.00);
        $campaign5->setStartDate(new \DateTimeImmutable('2025-04-01'));
        $campaign5->setEndDate(new \DateTimeImmutable('2025-06-30'));
        $campaign5->setStatus('active');
        $manager->persist($campaign5);

        $campaign6 = new Campaign();
        $campaign6->setName('Fitness & Wellness Program');
        $campaign6->setBudget(6200.00);
        $campaign6->setStartDate(new \DateTimeImmutable('2025-01-15'));
        $campaign6->setEndDate(new \DateTimeImmutable('2025-03-15'));
        $campaign6->setStatus('completed');
        $manager->persist($campaign6);

        // Additional Campaigns for more comprehensive data
        $campaign7 = new Campaign();
        $campaign7->setName('Black Friday Mega Sale 2025');
        $campaign7->setBudget(25000.00);
        $campaign7->setStartDate(new \DateTimeImmutable('2025-11-20'));
        $campaign7->setEndDate(new \DateTimeImmutable('2025-11-30'));
        $campaign7->setStatus('draft');
        $manager->persist($campaign7);

        $campaign8 = new Campaign();
        $campaign8->setName('Cyber Monday Digital Deals');
        $campaign8->setBudget(18000.00);
        $campaign8->setStartDate(new \DateTimeImmutable('2025-12-01'));
        $campaign8->setEndDate(new \DateTimeImmutable('2025-12-02'));
        $campaign8->setStatus('draft');
        $manager->persist($campaign8);

        $campaign9 = new Campaign();
        $campaign9->setName('Valentine\'s Day Romance Collection');
        $campaign9->setBudget(4500.00);
        $campaign9->setStartDate(new \DateTimeImmutable('2025-02-01'));
        $campaign9->setEndDate(new \DateTimeImmutable('2025-02-14'));
        $campaign9->setStatus('completed');
        $manager->persist($campaign9);

        $campaign10 = new Campaign();
        $campaign10->setName('Easter Family Celebration');
        $campaign10->setBudget(3200.00);
        $campaign10->setStartDate(new \DateTimeImmutable('2025-03-20'));
        $campaign10->setEndDate(new \DateTimeImmutable('2025-04-20'));
        $campaign10->setStatus('completed');
        $manager->persist($campaign10);

        $campaign11 = new Campaign();
        $campaign11->setName('Mother\'s Day Special Offers');
        $campaign11->setBudget(5500.00);
        $campaign11->setStartDate(new \DateTimeImmutable('2025-05-01'));
        $campaign11->setEndDate(new \DateTimeImmutable('2025-05-12'));
        $campaign11->setStatus('active');
        $manager->persist($campaign11);

        $campaign12 = new Campaign();
        $campaign12->setName('Father\'s Day Tech Gifts');
        $campaign12->setBudget(4800.00);
        $campaign12->setStartDate(new \DateTimeImmutable('2025-06-01'));
        $campaign12->setEndDate(new \DateTimeImmutable('2025-06-16'));
        $campaign12->setStatus('active');
        $manager->persist($campaign12);

        $campaign13 = new Campaign();
        $campaign13->setName('Independence Day BBQ & Outdoor');
        $campaign13->setBudget(3800.00);
        $campaign13->setStartDate(new \DateTimeImmutable('2025-06-20'));
        $campaign13->setEndDate(new \DateTimeImmutable('2025-07-04'));
        $campaign13->setStatus('active');
        $manager->persist($campaign13);

        $campaign14 = new Campaign();
        $campaign14->setName('Halloween Costume & Party Supplies');
        $campaign14->setBudget(2900.00);
        $campaign14->setStartDate(new \DateTimeImmutable('2025-10-15'));
        $campaign14->setEndDate(new \DateTimeImmutable('2025-10-31'));
        $campaign14->setStatus('active');
        $manager->persist($campaign14);

        $campaign15 = new Campaign();
        $campaign15->setName('Thanksgiving Family Gathering');
        $campaign15->setBudget(4100.00);
        $campaign15->setStartDate(new \DateTimeImmutable('2025-11-15'));
        $campaign15->setEndDate(new \DateTimeImmutable('2025-11-28'));
        $campaign15->setStatus('draft');
        $manager->persist($campaign15);

        // Create Affiliates with more diverse and realistic data
        $affiliate1 = new Affiliate();
        $affiliate1->setName('TechReview Pro');
        $affiliate1->setEmail('contact@techreviewpro.com');
        $affiliate1->addCampaign($campaign1);
        $affiliate1->addCampaign($campaign3);
        $manager->persist($affiliate1);

        $affiliate2 = new Affiliate();
        $affiliate2->setName('Fashion Forward Magazine');
        $affiliate2->setEmail('partnerships@fashionforward.com');
        $affiliate2->addCampaign($campaign2);
        $affiliate2->addCampaign($campaign4);
        $manager->persist($affiliate2);

        $affiliate3 = new Affiliate();
        $affiliate3->setName('Home & Living Blog');
        $affiliate3->setEmail('collaborate@homeandlivingblog.com');
        $affiliate3->addCampaign($campaign5);
        $manager->persist($affiliate3);

        $affiliate4 = new Affiliate();
        $affiliate4->setName('Student Savings Network');
        $affiliate4->setEmail('deals@studentsavings.net');
        $affiliate4->addCampaign($campaign3);
        $affiliate4->addCampaign($campaign1);
        $manager->persist($affiliate4);

        $affiliate5 = new Affiliate();
        $affiliate5->setName('Wellness & Fitness Hub');
        $affiliate5->setEmail('affiliates@wellnesshub.com');
        $affiliate5->addCampaign($campaign6);
        $affiliate5->addCampaign($campaign5);
        $manager->persist($affiliate5);

        $affiliate6 = new Affiliate();
        $affiliate6->setName('Seasonal Deals Outlet');
        $affiliate6->setEmail('marketing@seasonaldeals.com');
        $affiliate6->addCampaign($campaign1);
        $affiliate6->addCampaign($campaign2);
        $affiliate6->addCampaign($campaign4);
        $manager->persist($affiliate6);

        $affiliate7 = new Affiliate();
        $affiliate7->setName('Digital Marketing Experts');
        $affiliate7->setEmail('partners@digitalmarketingexperts.com');
        $affiliate7->addCampaign($campaign3);
        $affiliate7->addCampaign($campaign5);
        $affiliate7->addCampaign($campaign6);
        $manager->persist($affiliate7);

        $affiliate8 = new Affiliate();
        $affiliate8->setName('Lifestyle & Trends');
        $affiliate8->setEmail('business@lifestyletrends.com');
        $affiliate8->addCampaign($campaign4);
        $affiliate8->addCampaign($campaign6);
        $manager->persist($affiliate8);

        // Additional Affiliates for more comprehensive partnerships
        $affiliate9 = new Affiliate();
        $affiliate9->setName('Holiday Shopping Guide');
        $affiliate9->setEmail('deals@holidayshoppingguide.com');
        $affiliate9->addCampaign($campaign2);
        $affiliate9->addCampaign($campaign7);
        $affiliate9->addCampaign($campaign8);
        $affiliate9->addCampaign($campaign15);
        $manager->persist($affiliate9);

        $affiliate10 = new Affiliate();
        $affiliate10->setName('Romantic Getaways Blog');
        $affiliate10->setEmail('partnerships@romanticgetaways.com');
        $affiliate10->addCampaign($campaign9);
        $manager->persist($affiliate10);

        $affiliate11 = new Affiliate();
        $affiliate11->setName('Family Fun Network');
        $affiliate11->setEmail('affiliates@familyfunnetwork.com');
        $affiliate11->addCampaign($campaign10);
        $affiliate11->addCampaign($campaign11);
        $affiliate11->addCampaign($campaign12);
        $manager->persist($affiliate11);

        $affiliate12 = new Affiliate();
        $affiliate12->setName('Tech Dad Reviews');
        $affiliate12->setEmail('sponsorships@techdadreviews.com');
        $affiliate12->addCampaign($campaign1);
        $affiliate12->addCampaign($campaign12);
        $manager->persist($affiliate12);

        $affiliate13 = new Affiliate();
        $affiliate13->setName('Outdoor Adventure Hub');
        $affiliate13->setEmail('collaborate@outdooradventurehub.com');
        $affiliate13->addCampaign($campaign5);
        $affiliate13->addCampaign($campaign13);
        $manager->persist($affiliate13);

        $affiliate14 = new Affiliate();
        $affiliate14->setName('Spooky Season Central');
        $affiliate14->setEmail('business@spookyseasoncentral.com');
        $affiliate14->addCampaign($campaign14);
        $manager->persist($affiliate14);

        $affiliate15 = new Affiliate();
        $affiliate15->setName('Gourmet Cooking Network');
        $affiliate15->setEmail('partnerships@gourmetcooking.net');
        $affiliate15->addCampaign($campaign15);
        $affiliate15->addCampaign($campaign10);
        $manager->persist($affiliate15);

        $affiliate16 = new Affiliate();
        $affiliate16->setName('Beauty & Wellness Magazine');
        $affiliate16->setEmail('advertising@beautywellnessmag.com');
        $affiliate16->addCampaign($campaign6);
        $affiliate16->addCampaign($campaign9);
        $affiliate16->addCampaign($campaign11);
        $manager->persist($affiliate16);

        // Create comprehensive Metrics for each campaign with realistic data
        // Campaign 1 Metrics (Summer Sale - Electronics)
        $metric1 = new Metric();
        $metric1->setName('Initial Campaign Launch');
        $metric1->setValue('1250.00');
        $metric1->setClicks(1250);
        $metric1->setConversions(25);
        $metric1->setRevenue('1250.00');
        $metric1->setNotes('First week performance metrics');
        $metric1->setTimestamp(new \DateTimeImmutable('2025-06-02'));
        $metric1->setCampaign($campaign1);
        $manager->persist($metric1);        $metric2 = new Metric();
        $metric2->setName('Conversions');
        $metric2->setValue('187.00');
        $metric2->setClicks(850);
        $metric2->setConversions(17);
        $metric2->setRevenue('187.00');
        $metric2->setNotes('Product purchases from campaign landing pages');
        $metric2->setTimestamp(new \DateTimeImmutable('2025-06-20'));
        $metric2->setCampaign($campaign1);
        $manager->persist($metric2);

        $metric3 = new Metric();
        $metric3->setName('Revenue Generated');
        $metric3->setValue('15680.50');
        $metric3->setClicks(5200);
        $metric3->setConversions(125);
        $metric3->setRevenue('15680.50');
        $metric3->setNotes('Total sales revenue attributed to campaign');
        $metric3->setTimestamp(new \DateTimeImmutable('2025-06-25'));
        $metric3->setCampaign($campaign1);
        $manager->persist($metric3);

        $metric4 = new Metric();
        $metric4->setName('Social Media Shares');
        $metric4->setValue('89.00');
        $metric4->setNotes('Campaign content shared on social platforms');
        $metric4->setTimestamp(new \DateTimeImmutable('2025-07-01'));
        $metric4->setCampaign($campaign1);
        $manager->persist($metric4);

        // Campaign 2 Metrics (Holiday Promotion)
        $metric5 = new Metric();
        $metric5->setName('Email Opens');
        $metric5->setValue('2100.00');
        $metric5->setNotes('Holiday newsletter opens from subscriber list');
        $metric5->setTimestamp(new \DateTimeImmutable('2025-12-05'));
        $metric5->setCampaign($campaign2);
        $manager->persist($metric5);

        $metric6 = new Metric();
        $metric6->setName('Click-through Rate');
        $metric6->setValue('12.50');
        $metric6->setNotes('Percentage of email recipients who clicked links');
        $metric6->setTimestamp(new \DateTimeImmutable('2025-12-10'));
        $metric6->setCampaign($campaign2);
        $manager->persist($metric6);

        $metric7 = new Metric();
        $metric7->setName('Holiday Sales');
        $metric7->setValue('8750.00');
        $metric7->setNotes('Revenue from holiday season promotions');
        $metric7->setTimestamp(new \DateTimeImmutable('2025-12-20'));
        $metric7->setCampaign($campaign2);
        $manager->persist($metric7);

        // Campaign 3 Metrics (Back-to-School)
        $metric8 = new Metric();
        $metric8->setName('Student Registrations');
        $metric8->setValue('450.00');
        $metric8->setNotes('New student accounts created during campaign');
        $metric8->setTimestamp(new \DateTimeImmutable('2025-08-20'));
        $metric8->setCampaign($campaign3);
        $manager->persist($metric8);

        $metric9 = new Metric();
        $metric9->setName('Textbook Sales');
        $metric9->setValue('320.00');
        $metric9->setNotes('Academic supplies purchased by students');
        $metric9->setTimestamp(new \DateTimeImmutable('2025-08-25'));
        $metric9->setCampaign($campaign3);
        $manager->persist($metric9);

        $metric10 = new Metric();
        $metric10->setName('Parent Inquiries');
        $metric10->setValue('180.00');
        $metric10->setNotes('Contact form submissions from parents');
        $metric10->setTimestamp(new \DateTimeImmutable('2025-09-01'));
        $metric10->setCampaign($campaign3);
        $manager->persist($metric10);

        $metric10a = new Metric();
        $metric10a->setName('Academic Revenue');
        $metric10a->setValue('9500.00');
        $metric10a->setNotes('Total revenue from textbook and supply sales');
        $metric10a->setTimestamp(new \DateTimeImmutable('2025-09-10'));
        $metric10a->setCampaign($campaign3);
        $manager->persist($metric10a);

        // Campaign 4 Metrics (Spring Fashion)
        $metric11 = new Metric();
        $metric11->setName('Fashion Blog Mentions');
        $metric11->setValue('75.00');
        $metric11->setNotes('Coverage from fashion influencer blogs');
        $metric11->setTimestamp(new \DateTimeImmutable('2025-03-15'));
        $metric11->setCampaign($campaign4);
        $manager->persist($metric11);

        $metric12 = new Metric();
        $metric12->setName('Apparel Revenue');
        $metric12->setValue('24500.00');
        $metric12->setNotes('Sales from spring clothing collection');
        $metric12->setTimestamp(new \DateTimeImmutable('2025-04-01'));
        $metric12->setCampaign($campaign4);
        $manager->persist($metric12);

        $metric13 = new Metric();
        $metric13->setName('Instagram Followers');
        $metric13->setValue('1200.00');
        $metric13->setNotes('New followers gained during fashion campaign');
        $metric13->setTimestamp(new \DateTimeImmutable('2025-04-15'));
        $metric13->setCampaign($campaign4);
        $manager->persist($metric13);

        // Campaign 5 Metrics (Home & Garden)
        $metric14 = new Metric();
        $metric14->setName('Garden Tool Sales');
        $metric14->setValue('290.00');
        $metric14->setNotes('Outdoor equipment purchases');
        $metric14->setTimestamp(new \DateTimeImmutable('2025-04-10'));
        $metric14->setCampaign($campaign5);
        $manager->persist($metric14);

        $metric15 = new Metric();
        $metric15->setName('Home Improvement Leads');
        $metric15->setValue('156.00');
        $metric15->setNotes('Contact forms from homeowners');
        $metric15->setTimestamp(new \DateTimeImmutable('2025-05-01'));
        $metric15->setCampaign($campaign5);
        $manager->persist($metric15);

        $metric16 = new Metric();
        $metric16->setName('DIY Workshop Signups');
        $metric16->setValue('85.00');
        $metric16->setNotes('Registrations for home improvement workshops');
        $metric16->setTimestamp(new \DateTimeImmutable('2025-05-15'));
        $metric16->setCampaign($campaign5);
        $manager->persist($metric16);

        $metric16a = new Metric();
        $metric16a->setName('Home Improvement Revenue');
        $metric16a->setValue('11200.00');
        $metric16a->setNotes('Revenue from tools, materials, and workshop fees');
        $metric16a->setTimestamp(new \DateTimeImmutable('2025-06-01'));
        $metric16a->setCampaign($campaign5);
        $manager->persist($metric16a);

        // Campaign 6 Metrics (Fitness & Wellness)
        $metric17 = new Metric();
        $metric17->setName('Gym Memberships');
        $metric17->setValue('340.00');
        $metric17->setNotes('New gym memberships from campaign');
        $metric17->setTimestamp(new \DateTimeImmutable('2025-01-20'));
        $metric17->setCampaign($campaign6);
        $manager->persist($metric17);

        $metric18 = new Metric();
        $metric18->setName('Fitness App Downloads');
        $metric18->setValue('1250.00');
        $metric18->setNotes('Mobile app installations');
        $metric18->setTimestamp(new \DateTimeImmutable('2025-02-01'));
        $metric18->setCampaign($campaign6);
        $manager->persist($metric18);

        $metric19 = new Metric();
        $metric19->setName('Wellness Consultations');
        $metric19->setValue('95.00');
        $metric19->setNotes('Booked wellness coaching sessions');
        $metric19->setTimestamp(new \DateTimeImmutable('2025-02-15'));
        $metric19->setCampaign($campaign6);
        $manager->persist($metric19);

        $metric20 = new Metric();
        $metric20->setName('Nutrition Plan Sales');
        $metric20->setValue('180.00');
        $metric20->setNotes('Custom meal plan purchases');
        $metric20->setTimestamp(new \DateTimeImmutable('2025-03-01'));
        $metric20->setCampaign($campaign6);
        $manager->persist($metric20);

        $metric20a = new Metric();
        $metric20a->setName('Wellness Program Revenue');
        $metric20a->setValue('8500.00');
        $metric20a->setNotes('Revenue from memberships, consultations, and plans');
        $metric20a->setTimestamp(new \DateTimeImmutable('2025-03-10'));
        $metric20a->setCampaign($campaign6);
        $manager->persist($metric20a);

        // Campaign 7 Metrics (Black Friday Mega Sale)
        $metric21 = new Metric();
        $metric21->setName('Pre-Black Friday Traffic');
        $metric21->setValue('5000.00');
        $metric21->setNotes('Website visitors in the week before Black Friday');
        $metric21->setTimestamp(new \DateTimeImmutable('2025-11-25'));
        $metric21->setCampaign($campaign7);
        $manager->persist($metric21);

        $metric22 = new Metric();
        $metric22->setName('Black Friday Sales Volume');
        $metric22->setValue('1250.00');
        $metric22->setNotes('Total units sold on Black Friday');
        $metric22->setTimestamp(new \DateTimeImmutable('2025-11-29'));
        $metric22->setCampaign($campaign7);
        $manager->persist($metric22);

        $metric23 = new Metric();
        $metric23->setName('Mega Sale Revenue');
        $metric23->setValue('45000.00');
        $metric23->setNotes('Total revenue from Black Friday campaign');
        $metric23->setTimestamp(new \DateTimeImmutable('2025-11-30'));
        $metric23->setCampaign($campaign7);
        $manager->persist($metric23);

        // Campaign 8 Metrics (Cyber Monday)
        $metric24 = new Metric();
        $metric24->setName('Cyber Monday Clicks');
        $metric24->setValue('3200.00');
        $metric24->setNotes('Digital product page visits');
        $metric24->setTimestamp(new \DateTimeImmutable('2025-12-01'));
        $metric24->setCampaign($campaign8);
        $manager->persist($metric24);

        $metric25 = new Metric();
        $metric25->setName('Digital Product Sales');
        $metric25->setValue('890.00');
        $metric25->setNotes('Software and digital downloads sold');
        $metric25->setTimestamp(new \DateTimeImmutable('2025-12-02'));
        $metric25->setCampaign($campaign8);
        $manager->persist($metric25);

        $metric26 = new Metric();
        $metric26->setName('Cyber Monday Revenue');
        $metric26->setValue('28500.00');
        $metric26->setNotes('Revenue from digital products and services');
        $metric26->setTimestamp(new \DateTimeImmutable('2025-12-03'));
        $metric26->setCampaign($campaign8);
        $manager->persist($metric26);

        // Campaign 9 Metrics (Valentine's Day)
        $metric27 = new Metric();
        $metric27->setName('Romance Product Views');
        $metric27->setValue('1800.00');
        $metric27->setNotes('Page views for romantic products');
        $metric27->setTimestamp(new \DateTimeImmutable('2025-02-05'));
        $metric27->setCampaign($campaign9);
        $manager->persist($metric27);

        $metric28 = new Metric();
        $metric28->setName('Valentine Gift Sales');
        $metric28->setValue('420.00');
        $metric28->setNotes('Units sold for Valentine\'s Day');
        $metric28->setTimestamp(new \DateTimeImmutable('2025-02-14'));
        $metric28->setCampaign($campaign9);
        $manager->persist($metric28);

        $metric29 = new Metric();
        $metric29->setName('Romance Campaign Revenue');
        $metric29->setValue('7200.00');
        $metric29->setNotes('Revenue from romantic products and gifts');
        $metric29->setTimestamp(new \DateTimeImmutable('2025-02-15'));
        $metric29->setCampaign($campaign9);
        $manager->persist($metric29);

        // Campaign 10 Metrics (Easter)
        $metric30 = new Metric();
        $metric30->setName('Family Activity Signups');
        $metric30->setValue('650.00');
        $metric30->setNotes('Easter egg hunts and family events');
        $metric30->setTimestamp(new \DateTimeImmutable('2025-03-25'));
        $metric30->setCampaign($campaign10);
        $manager->persist($metric30);

        $metric31 = new Metric();
        $metric31->setName('Easter Basket Sales');
        $metric31->setValue('380.00');
        $metric31->setNotes('Holiday baskets and family gifts');
        $metric31->setTimestamp(new \DateTimeImmutable('2025-04-10'));
        $metric31->setCampaign($campaign10);
        $manager->persist($metric31);

        $metric32 = new Metric();
        $metric32->setName('Easter Celebration Revenue');
        $metric32->setValue('5800.00');
        $metric32->setNotes('Revenue from Easter products and events');
        $metric32->setTimestamp(new \DateTimeImmutable('2025-04-20'));
        $metric32->setCampaign($campaign10);
        $manager->persist($metric32);

        // Campaign 11 Metrics (Mother's Day)
        $metric33 = new Metric();
        $metric33->setName('Gift Guide Views');
        $metric33->setValue('2100.00');
        $metric33->setNotes('Mother\'s Day gift recommendations viewed');
        $metric33->setTimestamp(new \DateTimeImmutable('2025-05-05'));
        $metric33->setCampaign($campaign11);
        $manager->persist($metric33);

        $metric34 = new Metric();
        $metric34->setName('Personalized Gift Orders');
        $metric34->setValue('290.00');
        $metric34->setNotes('Custom and personalized gifts ordered');
        $metric34->setTimestamp(new \DateTimeImmutable('2025-05-10'));
        $metric34->setCampaign($campaign11);
        $manager->persist($metric34);

        $metric35 = new Metric();
        $metric35->setName('Mother\'s Day Revenue');
        $metric35->setValue('9200.00');
        $metric35->setNotes('Revenue from Mother\'s Day gifts and services');
        $metric35->setTimestamp(new \DateTimeImmutable('2025-05-12'));
        $metric35->setCampaign($campaign11);
        $manager->persist($metric35);

        // Campaign 12 Metrics (Father's Day)
        $metric36 = new Metric();
        $metric36->setName('Tech Gift Searches');
        $metric36->setValue('1600.00');
        $metric36->setNotes('Searches for technology gifts');
        $metric36->setTimestamp(new \DateTimeImmutable('2025-06-08'));
        $metric36->setCampaign($campaign12);
        $manager->persist($metric36);

        $metric37 = new Metric();
        $metric37->setName('Gadget Sales');
        $metric37->setValue('340.00');
        $metric37->setNotes('Tech gadgets and accessories sold');
        $metric37->setTimestamp(new \DateTimeImmutable('2025-06-15'));
        $metric37->setCampaign($campaign12);
        $manager->persist($metric37);

        $metric38 = new Metric();
        $metric38->setName('Father\'s Day Tech Revenue');
        $metric38->setValue('7800.00');
        $metric38->setNotes('Revenue from tech gifts and gadgets');
        $metric38->setTimestamp(new \DateTimeImmutable('2025-06-16'));
        $metric38->setCampaign($campaign12);
        $manager->persist($metric38);

        // Campaign 13 Metrics (Independence Day)
        $metric39 = new Metric();
        $metric39->setName('BBQ Product Views');
        $metric39->setValue('1200.00');
        $metric39->setNotes('Outdoor cooking and party supplies viewed');
        $metric39->setTimestamp(new \DateTimeImmutable('2025-06-25'));
        $metric39->setCampaign($campaign13);
        $manager->persist($metric39);

        $metric40 = new Metric();
        $metric40->setName('Patriotic Sales');
        $metric40->setValue('280.00');
        $metric40->setNotes('Holiday-themed products sold');
        $metric40->setTimestamp(new \DateTimeImmutable('2025-07-02'));
        $metric40->setCampaign($campaign13);
        $manager->persist($metric40);

        $metric41 = new Metric();
        $metric41->setName('Summer Celebration Revenue');
        $metric41->setValue('6400.00');
        $metric41->setNotes('Revenue from BBQ and outdoor products');
        $metric41->setTimestamp(new \DateTimeImmutable('2025-07-04'));
        $metric41->setCampaign($campaign13);
        $manager->persist($metric41);

        // Campaign 14 Metrics (Halloween)
        $metric42 = new Metric();
        $metric42->setName('Costume Searches');
        $metric42->setValue('950.00');
        $metric42->setNotes('Halloween costume and party searches');
        $metric42->setTimestamp(new \DateTimeImmutable('2025-10-20'));
        $metric42->setCampaign($campaign14);
        $manager->persist($metric42);

        $metric43 = new Metric();
        $metric43->setName('Party Supply Orders');
        $metric43->setValue('420.00');
        $metric43->setNotes('Decorations and party supplies ordered');
        $metric43->setTimestamp(new \DateTimeImmutable('2025-10-28'));
        $metric43->setCampaign($campaign14);
        $manager->persist($metric43);

        $metric44 = new Metric();
        $metric44->setName('Halloween Revenue');
        $metric44->setValue('5100.00');
        $metric44->setNotes('Revenue from costumes and party supplies');
        $metric44->setTimestamp(new \DateTimeImmutable('2025-10-31'));
        $metric44->setCampaign($campaign14);
        $manager->persist($metric44);

        // Campaign 15 Metrics (Thanksgiving)
        $metric45 = new Metric();
        $metric45->setName('Thanksgiving Recipe Views');
        $metric45->setValue('1800.00');
        $metric45->setNotes('Holiday recipe and meal planning content');
        $metric45->setTimestamp(new \DateTimeImmutable('2025-11-18'));
        $metric45->setCampaign($campaign15);
        $manager->persist($metric45);

        $metric46 = new Metric();
        $metric46->setName('Holiday Meal Kits');
        $metric46->setValue('350.00');
        $metric46->setNotes('Pre-packaged Thanksgiving meals sold');
        $metric46->setTimestamp(new \DateTimeImmutable('2025-11-25'));
        $metric46->setCampaign($campaign15);
        $manager->persist($metric46);

        $metric47 = new Metric();
        $metric47->setName('Thanksgiving Revenue');
        $metric47->setValue('6900.00');
        $metric47->setNotes('Revenue from holiday meals and gatherings');
        $metric47->setTimestamp(new \DateTimeImmutable('2025-11-28'));
        $metric47->setCampaign($campaign15);
        $manager->persist($metric47);

        $manager->flush();
    }
}

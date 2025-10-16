<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251014124956 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE affiliate (id SERIAL NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_597AA5CFE7927C74 ON affiliate (email)');
        $this->addSql('COMMENT ON COLUMN affiliate.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN affiliate.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE affiliate_campaign (affiliate_id INT NOT NULL, campaign_id INT NOT NULL, PRIMARY KEY(affiliate_id, campaign_id))');
        $this->addSql('CREATE INDEX IDX_D79FA4969F12C49A ON affiliate_campaign (affiliate_id)');
        $this->addSql('CREATE INDEX IDX_D79FA496F639F774 ON affiliate_campaign (campaign_id)');
        $this->addSql('CREATE TABLE campaign_affiliate (campaign_id INT NOT NULL, affiliate_id INT NOT NULL, PRIMARY KEY(campaign_id, affiliate_id))');
        $this->addSql('CREATE INDEX IDX_99F2B9B4F639F774 ON campaign_affiliate (campaign_id)');
        $this->addSql('CREATE INDEX IDX_99F2B9B49F12C49A ON campaign_affiliate (affiliate_id)');
        $this->addSql('CREATE TABLE metric (id SERIAL NOT NULL, campaign_id INT NOT NULL, name VARCHAR(255) NOT NULL, value NUMERIC(10, 2) NOT NULL, timestamp TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_87D62EE3F639F774 ON metric (campaign_id)');
        $this->addSql('COMMENT ON COLUMN metric.timestamp IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN metric.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN metric.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE affiliate_campaign ADD CONSTRAINT FK_D79FA4969F12C49A FOREIGN KEY (affiliate_id) REFERENCES affiliate (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE affiliate_campaign ADD CONSTRAINT FK_D79FA496F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE campaign_affiliate ADD CONSTRAINT FK_99F2B9B4F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE campaign_affiliate ADD CONSTRAINT FK_99F2B9B49F12C49A FOREIGN KEY (affiliate_id) REFERENCES affiliate (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE metric ADD CONSTRAINT FK_87D62EE3F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE campaign ADD end_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE campaign ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE campaign ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE campaign ALTER budget TYPE NUMERIC(10, 2)');
        $this->addSql('ALTER TABLE campaign ALTER budget SET DEFAULT \'0\'');
        $this->addSql('ALTER TABLE campaign ALTER start_date TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE campaign ALTER status SET DEFAULT \'draft\'');
        $this->addSql('COMMENT ON COLUMN campaign.end_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN campaign.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN campaign.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN campaign.start_date IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE affiliate_campaign DROP CONSTRAINT FK_D79FA4969F12C49A');
        $this->addSql('ALTER TABLE affiliate_campaign DROP CONSTRAINT FK_D79FA496F639F774');
        $this->addSql('ALTER TABLE campaign_affiliate DROP CONSTRAINT FK_99F2B9B4F639F774');
        $this->addSql('ALTER TABLE campaign_affiliate DROP CONSTRAINT FK_99F2B9B49F12C49A');
        $this->addSql('ALTER TABLE metric DROP CONSTRAINT FK_87D62EE3F639F774');
        $this->addSql('DROP TABLE affiliate');
        $this->addSql('DROP TABLE affiliate_campaign');
        $this->addSql('DROP TABLE campaign_affiliate');
        $this->addSql('DROP TABLE metric');
        $this->addSql('ALTER TABLE campaign DROP end_date');
        $this->addSql('ALTER TABLE campaign DROP created_at');
        $this->addSql('ALTER TABLE campaign DROP updated_at');
        $this->addSql('ALTER TABLE campaign ALTER budget TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE campaign ALTER budget DROP DEFAULT');
        $this->addSql('ALTER TABLE campaign ALTER start_date TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE campaign ALTER status DROP DEFAULT');
        $this->addSql('COMMENT ON COLUMN campaign.start_date IS NULL');
    }
}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251016182446 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        if (!$schema->getTable('metric')->hasColumn('clicks')) {
            $this->addSql('ALTER TABLE metric ADD clicks INT DEFAULT NULL');
        }
        if (!$schema->getTable('metric')->hasColumn('conversions')) {
            $this->addSql('ALTER TABLE metric ADD conversions INT DEFAULT NULL');
        }
        if (!$schema->getTable('metric')->hasColumn('revenue')) {
            $this->addSql('ALTER TABLE metric ADD revenue NUMERIC(10, 2) DEFAULT NULL');
        }
        if ($schema->getTable('metric')->hasColumn('notes')) {
            $this->addSql('ALTER TABLE metric DROP notes');
        }
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE metric ADD notes TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE metric DROP clicks');
        $this->addSql('ALTER TABLE metric DROP conversions');
        $this->addSql('ALTER TABLE metric DROP revenue');
    }
}

/**
 * SEED DATA — Development database seed
 * Source of truth: DATABASE.md Section 39
 * 
 * Run: npx tsx backend/db/seed.ts
 * 
 * Seeds:
 *   1 admin user
 *   1 template
 *   2 themes
 *   1 invitation
 *   1 couple
 *   2 events
 *   3 story items
 *   5 gallery items (placeholder)
 *   2 gifts
 *   5 guests
 *   2 RSVPs
 *   3 wishes
 */

import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Clean existing data (in reverse dependency order)
    console.log('  🧹 Cleaning existing data...');
    await sql`TRUNCATE TABLE audit_logs CASCADE`;
    await sql`TRUNCATE TABLE wishes CASCADE`;
    await sql`TRUNCATE TABLE rsvps CASCADE`;
    await sql`TRUNCATE TABLE guest_access_tokens CASCADE`;
    await sql`TRUNCATE TABLE guests CASCADE`;
    await sql`TRUNCATE TABLE gifts CASCADE`;
    await sql`TRUNCATE TABLE gallery_items CASCADE`;
    await sql`TRUNCATE TABLE assets CASCADE`;
    await sql`TRUNCATE TABLE stories CASCADE`;
    await sql`TRUNCATE TABLE events CASCADE`;
    await sql`TRUNCATE TABLE couples CASCADE`;
    await sql`TRUNCATE TABLE invitations CASCADE`;
    await sql`TRUNCATE TABLE themes CASCADE`;
    await sql`TRUNCATE TABLE templates CASCADE`;
    await sql`TRUNCATE TABLE verifications CASCADE`;
    await sql`TRUNCATE TABLE sessions CASCADE`;
    await sql`TRUNCATE TABLE accounts CASCADE`;
    await sql`TRUNCATE TABLE users CASCADE`;

    // 1. Create admin user
    console.log('  👤 Creating admin user...');
    const [admin] = await sql`
      INSERT INTO users (name, email, email_verified)
      VALUES ('Admin', 'admin@wedding-platform.com', true)
      RETURNING id
    `;
    const adminId = admin.id;
    console.log(`    ✓ Admin user: ${adminId}`);

    // 2. Create template
    console.log('  📐 Creating template...');
    const [template] = await sql`
      INSERT INTO templates (slug, name, description, version, config)
      VALUES (
        'classic',
        'Classic Floral Blue',
        'Elegant floral wedding invitation with blue palette',
        '1.0.0',
        '{"sections": ["cover", "quote", "couple", "countdown", "events", "story", "gallery", "gift", "rsvp", "wishes", "closing"]}'::jsonb
      )
      RETURNING id
    `;
    const templateId = template.id;
    console.log(`    ✓ Template: ${templateId}`);

    // 3. Create themes
    console.log('  🎨 Creating themes...');
    const [floralBlue] = await sql`
      INSERT INTO themes (slug, name, description, config)
      VALUES (
        'floral-blue',
        'Floral Blue',
        'Elegant blue with ivory background',
        '{"colors": {"primary": "#4A6FA5", "secondary": "#8BA8D0", "background": "#FAF7F2", "surface": "#FFFFFF", "text": "#2D2926"}, "typography": {"heading": "Cormorant Garamond", "body": "Inter"}, "buttons": {"radius": "9999px"}, "animation": {"intensity": "medium"}}'::jsonb
      )
      RETURNING id
    `;

    const [warmGold] = await sql`
      INSERT INTO themes (slug, name, description, config)
      VALUES (
        'warm-gold',
        'Warm Gold',
        'Classic gold accent with warm tones',
        '{"colors": {"primary": "#8A6A52", "secondary": "#D8C4B6", "background": "#FAF7F2", "surface": "#FFFFFF", "text": "#2D2926"}, "typography": {"heading": "Playfair Display", "body": "Inter"}, "buttons": {"radius": "9999px"}, "animation": {"intensity": "medium"}}'::jsonb
      )
      RETURNING id
    `;
    const themeId = floralBlue.id;
    console.log(`    ✓ Theme 1 (floral-blue): ${themeId}`);
    console.log(`    ✓ Theme 2 (warm-gold): ${warmGold.id}`);

    // 4. Create invitation
    console.log('  💌 Creating invitation...');
    const [invitation] = await sql`
      INSERT INTO invitations (owner_id, template_id, theme_id, slug, title, status, settings, published_at)
      VALUES (
        ${adminId},
        ${templateId},
        ${themeId},
        'fauzan-indah',
        'Fauzan & Indah',
        'published',
        '{"music": {"enabled": true}, "showCountdown": true, "showStory": true, "showGallery": true, "showGift": true, "showRsvp": true, "showWishes": true}'::jsonb,
        NOW()
      )
      RETURNING id
    `;
    const invitationId = invitation.id;
    console.log(`    ✓ Invitation: ${invitationId}`);

    // 5. Create couple
    console.log('  💑 Creating couple...');
    await sql`
      INSERT INTO couples (invitation_id, groom_name, groom_nickname, groom_father_name, groom_mother_name, bride_name, bride_nickname, bride_father_name, bride_mother_name)
      VALUES (
        ${invitationId},
        'Muhammad Fauzan',
        'Fauzan',
        'Bapak Ahmad',
        'Ibu Siti',
        'Indah Permata Sari',
        'Indah',
        'Bapak Budi',
        'Ibu Ratna'
      )
    `;
    console.log('    ✓ Couple created');

    // 6. Create events
    console.log('  📅 Creating events...');
    await sql`
      INSERT INTO events (invitation_id, type, title, event_date, start_time, end_time, timezone, venue_name, address, sort_order)
      VALUES
        (${invitationId}, 'akad', 'Akad Nikah', '2026-10-10', '08:00', '10:00', 'Asia/Jakarta', 'Masjid Agung', 'Jl. Pusat Kota No. 1, Jakarta', 0),
        (${invitationId}, 'reception', 'Resepsi Pernikahan', '2026-10-10', '11:00', '14:00', 'Asia/Jakarta', 'Grand Ballroom Hotel', 'Jl. Sudirman No. 100, Jakarta', 1)
    `;
    console.log('    ✓ 2 events created');

    // 7. Create stories
    console.log('  📖 Creating stories...');
    await sql`
      INSERT INTO stories (invitation_id, year_label, title, description, sort_order)
      VALUES
        (${invitationId}, '2019', 'Pertama Bertemu', 'Kami pertama kali bertemu di kampus, saat itu bulan September yang cerah.', 0),
        (${invitationId}, '2021', 'Mulai Berhubungan', 'Setelah saling mengenal lebih dekat, kami memutuskan untuk berpacaran.', 1),
        (${invitationId}, '2025', 'Lamaran', 'Dengan restu kedua orang tua, Fauzan melamar Indah di bulan yang penuh berkah.', 2)
    `;
    console.log('    ✓ 3 stories created');

    // 8. Create gifts
    console.log('  🎁 Creating gifts...');
    await sql`
      INSERT INTO gifts (invitation_id, type, label, bank_name, account_number, account_holder, sort_order)
      VALUES
        (${invitationId}, 'bank', 'Hadiah Pernikahan', 'Bank Central Asia (BCA)', '1234567890', 'Muhammad Fauzan', 0),
        (${invitationId}, 'bank', 'Kado Pernikahan', 'Bank Mandiri', '0987654321', 'Indah Permata Sari', 1)
    `;
    console.log('    ✓ 2 gifts created');

    // 9. Create guests
    console.log('  👥 Creating guests...');
    const guests = await sql`
      INSERT INTO guests (invitation_id, name, phone, guest_group, max_guest_count, status)
      VALUES
        (${invitationId}, 'Bapak Ahmad (Kakek)', '081234567890', 'Keluarga Mempelai Pria', 2, 'invited'),
        (${invitationId}, 'Ibu Ratna', '081234567891', 'Keluarga Mempelai Wanita', 2, 'invited'),
        (${invitationId}, 'Mas Rizky', '081234567892', 'Teman Kuliah', 1, 'viewed'),
        (${invitationId}, 'Mbak Salsa', '081234567893', 'Teman Kantor', 1, 'responded'),
        (${invitationId}, 'Pak Dodi', '081234567894', 'Tetangga', 3, 'invited')
      RETURNING id, name
    `;
    console.log(`    ✓ ${guests.length} guests created`);

    // 10. Create RSVPs for 2 guests
    console.log('  ✅ Creating RSVPs...');
    const rsvpGuest1 = guests[3]; // Mbak Salsa (responded)
    const rsvpGuest2 = guests[2]; // Mas Rizky (viewed)
    await sql`
      INSERT INTO rsvps (invitation_id, guest_id, status, guest_count, message, submitted_at)
      VALUES
        (${invitationId}, ${rsvpGuest1.id}, 'attending', 1, 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah mawaddah warahmah.', NOW()),
        (${invitationId}, ${rsvpGuest2.id}, 'maybe', 1, 'Insya Allah bisa hadir, doakan ya!', NOW())
    `;
    console.log('    ✓ 2 RSVPs created');

    // 11. Create wishes
    console.log('  💌 Creating wishes...');
    await sql`
      INSERT INTO wishes (invitation_id, name, message, status)
      VALUES
        (${invitationId}, 'Mbak Salsa', 'Selamat menempuh hidup baru! Semoga selalu diberkahi kebahagiaan.', 'approved'),
        (${invitationId}, 'Mas Rizky', 'Barakallahu lakuma wa baraka alaikuma.', 'approved'),
        (${invitationId}, 'Anonymous', 'Semoga langgeng sampai kakek nenek! Aamiin.', 'pending')
    `;
    console.log('    ✓ 3 wishes created');

    console.log('');
    console.log('🎉 Seed completed successfully!');
    console.log('');
    console.log('Summary:');
    console.log(`  Admin: admin@wedding-platform.com`);
    console.log(`  Invitation: /fauzan-indah`);
    console.log(`  Template: classic`);
    console.log(`  Theme: floral-blue`);
    console.log(`  Couple: Fauzan & Indah`);
    console.log(`  Events: 2 (Akad + Resepsi)`);
    console.log(`  Stories: 3`);
    console.log(`  Gifts: 2`);
    console.log(`  Guests: 5`);
    console.log(`  RSVPs: 2`);
    console.log(`  Wishes: 3`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

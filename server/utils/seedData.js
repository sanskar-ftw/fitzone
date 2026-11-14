/**
 * Seed script — populates the database with initial authentic Indian fitness demo data.
 * Run with: npm run seed
 *
 * WARNING: This will CLEAR all existing data before seeding.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Facility = require('../models/Facility');
const Plan = require('../models/Plan');
const Membership = require('../models/Membership');
const Enquiry = require('../models/Enquiry');

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // ── Clear all collections ───────────────────────────────────────────
    await Promise.all([
      User.deleteMany(),
      Trainer.deleteMany(),
      Facility.deleteMany(),
      Plan.deleteMany(),
      Membership.deleteMany(),
      Enquiry.deleteMany(),
    ]);
    console.log('All collections cleared.');

    // ── Users ────────────────────────────────────────────────────────────
    const adminSalt = await bcrypt.genSalt(10);
    const userSalt = await bcrypt.genSalt(10);

    await User.insertMany([
      {
        name: 'Admin Console',
        email: 'admin@fitzone.com',
        password: await bcrypt.hash('admin123', adminSalt),
        role: 'admin',
        phone: '+91 98860 12345',
      },
      {
        name: 'Arjun Verma',
        email: 'arjun@fitzone.in',
        password: await bcrypt.hash('user123', userSalt),
        role: 'user',
        phone: '+91 98765 43210',
        fitnessGoal: 'Hypertrophy & Strength',
        currentWeight: 78,
        targetWeight: 75,
        height: 180,
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@fitzone.in',
        password: await bcrypt.hash('user123', userSalt),
        role: 'user',
        phone: '+91 98234 56789',
        fitnessGoal: 'Endurance & Flexibility',
        currentWeight: 58,
        targetWeight: 55,
        height: 165,
      },
    ]);
    console.log('Users seeded with authentic Indian accounts.');

    // ── Trainers ─────────────────────────────────────────────────────────
    await Trainer.insertMany([
      {
        name: 'Vikramaditya Singhania',
        specialization: 'Weight Training & Powerlifting',
        experience: 9,
        bio: 'National-level powerlifter and CSCS-certified strength coach. Specialises in Olympic barbell mechanics, compound strength progression, and high-performance hypertrophy for competitive and lifestyle athletes.',
        image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&h=750&fit=crop',
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        specialization: 'Ashtanga Yoga & Mobility',
        experience: 10,
        bio: '500-hour RYT certified master yogi trained in Rishikesh. Blends intense Vinyasa flow, deep spinal mobility, and pranayama breathwork to build mental composure and injury-free athletic longevity.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=750&fit=crop',
        isActive: true,
      },
      {
        name: 'Rohan Deshmukh',
        specialization: 'Cardio & Conditioning',
        experience: 7,
        bio: 'Former state sprinter and ACE-certified performance conditioning coach. Designs high-tempo functional endurance protocols, sled pushing, and sprint intervals that build relentless cardiovascular capacity.',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=750&fit=crop',
        isActive: true,
      },
      {
        name: 'Ananya Iyer',
        specialization: 'CrossFit & Functional Training',
        experience: 6,
        bio: 'CrossFit Level-2 certified coach and competitive regional athlete. Leads high-intensity barbell cycling, gymnastics muscle-up progression, and functional metabolic conditioning.',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=750&fit=crop',
        isActive: true,
      },
    ]);
    console.log('Trainers seeded with Indian coaches.');

    // ── Facilities ───────────────────────────────────────────────────────
    await Facility.insertMany([
      {
        name: 'Olympic Strength Floor',
        description:
          '15,000 sq. ft. precision-engineered weight room equipped with IPF-certified Eleiko barbells, calibrated steel plates, Hammer Strength plate-loaded iso-lateral machines, and 8 dedicated deadlift platforms with shock-absorbent drop zones.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
        isActive: true,
      },
      {
        name: 'Temperature-Controlled 25m Lap Pool',
        description:
          'Semi-Olympic heated indoor pool maintained at optimal 26°C with UV multi-stage filtration. Designed for low-impact active recovery, cardiovascular sprint intervals, and weekend swim clinics.',
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop',
        isActive: true,
      },
      {
        name: 'Zen Mind & Movement Sanctuary',
        description:
          'Acoustically insulated teak-wood studio equipped with Manduka PRO mats, Iyengar ropes, and Himalayan salt ambient lighting. Hosts daily Ashtanga, Yin Yoga, and guided breathwork sessions.',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop',
        isActive: true,
      },
      {
        name: 'Cardio & High-Altitude Sprint Suite',
        description:
          'Dedicated endurance floor featuring Woodway curved motorless treadmills, Concept2 RowErgs and SkiErgs, Wattbikes, and StairMasters with integrated performance biometric telemetry.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
        isActive: true,
      },
    ]);
    console.log('Facilities seeded.');

    // ── Plans ────────────────────────────────────────────────────────────
    await Plan.insertMany([
      {
        name: 'Essential Floor',
        price: 2499,
        durationInDays: 30,
        features: [
          'Full access to 15,000 sq ft Olympic floor',
          'Keyless biometric digital lockers',
          'Rain showers & luxury towel service',
          '1 complimentary coach fitness assessment',
        ],
        isPopular: false,
      },
      {
        name: 'Pro Athlete',
        price: 4499,
        durationInDays: 30,
        features: [
          'All Essential Floor privileges',
          'Unlimited recovery pool & cedar sauna access',
          'Access to all weekend conditioning workshops',
          '2 monthly 1-on-1 personal coaching sessions',
          'Quarterly body composition & InBody DEXA analysis',
        ],
        isPopular: true,
      },
      {
        name: 'Elite Obsidian',
        price: 7999,
        durationInDays: 30,
        features: [
          'All Pro Athlete privileges',
          'Dedicated personal coach (8 private sessions/month)',
          'Personalized macro & sports nutrition roadmap',
          'Complimentary cryotherapy & recovery lounge access',
          '24/7 VIP keycard access & private member parking',
        ],
        isPopular: false,
      },
    ]);
    console.log('Plans seeded with realistic INR pricing.');

    console.log('\n✅ Database successfully seeded with authentic Indian fitness data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();

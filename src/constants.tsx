import { 
  Layout, 
  Palette, 
  Box, 
  FileText, 
  Megaphone, 
  Search, 
  Mail, 
  Target, 
  Calendar, 
  Share2, 
  TrendingUp, 
  Code, 
  Film, 
  DraftingCompass, 
  Settings, 
  Briefcase, 
  Globe, 
  Zap, 
  Video, 
  Smartphone,
  Car,
  Shirt,
  Gamepad2,
  Home,
  GraduationCap
} from 'lucide-react';
import { Module } from './types';

export const TIERS = [
  { id: 1, name: 'Creator Engine', description: 'Fast Revenue Generation' },
  { id: 2, name: 'Automation & Marketing', description: 'Scale & Reach' },
  { id: 3, name: 'Innovation & Production', description: 'Enterprise Grade' },
  { id: 4, name: 'Education & Academy', description: 'Hybrid Learning' }
];

export const MODULES: Module[] = [
  // Tier 1
  { id: 'web-builder', name: 'App & Web Builder', description: 'Frontend-first rapid deployment', tier: 1, icon: 'Layout', status: 'active' },
  { id: 'logo-designer', name: 'Logo & Brand Designer', description: 'AI-powered visual identity', tier: 1, icon: 'Palette', status: 'active' },
  { id: 'product-mockups', name: 'Product Mockups', description: 'Phones, cars, clothes, consoles', tier: 1, icon: 'Box', status: 'active' },
  { id: 'resume-builder', name: 'Business Doc Builder', description: 'Resumes & professional papers', tier: 1, icon: 'FileText', status: 'active' },
  { id: 'social-builder', name: 'Social Campaign Builder', description: 'Viral content generation', tier: 1, icon: 'Megaphone', status: 'active' },
  { id: 'report-gen', name: 'Research Reports', description: 'Deep-dive content analysis', tier: 1, icon: 'Search', status: 'active' },

  // Tier 2
  { id: 'email-outreach', name: 'Email Outreach', description: 'Automated cold email sequences', tier: 2, icon: 'Mail', status: 'active' },
  { id: 'lead-hunting', name: 'Lead Hunting', description: 'AI client discovery engine', tier: 2, icon: 'Target', status: 'active' },
  { id: 'campaign-sched', name: 'Campaign Scheduler', description: 'Multi-platform post timing', tier: 2, icon: 'Calendar', status: 'active' },
  { id: 'affiliate-engine', name: 'Affiliate Engine', description: 'Passive revenue automation', tier: 2, icon: 'Share2', status: 'active' },
  { id: 'marketplace-pub', name: 'Marketplace Publishing', description: 'One-click product launch', tier: 2, icon: 'Globe', status: 'active' },
  { id: 'rev-tracking', name: 'Revenue Tracking', description: 'Real-time earnings dashboard', tier: 2, icon: 'TrendingUp', status: 'active' },

  // Tier 3
  { id: 'saas-prod', name: 'Full SaaS Production', description: 'Backend + Deployment automation', tier: 3, icon: 'Code', status: 'active' },
  { id: 'animation-studio', name: 'Animation Studio', description: 'Media rendering & short films', tier: 3, icon: 'Film', status: 'active' },
  { id: 'prototype-design', name: 'Prototype Studio', description: 'Advanced product engineering', tier: 3, icon: 'DraftingCompass', status: 'active' },
  { id: 'enterprise-dash', name: 'Enterprise Dashboards', description: 'High-level business control', tier: 3, icon: 'Settings', status: 'active' },
  { id: 'project-mgmt', name: 'Project Management', description: 'Client-facing collaboration', tier: 3, icon: 'Briefcase', status: 'active' },
  { id: 'infra-builder', name: 'SaaS Infrastructure', description: 'Cloud scaling & security', tier: 3, icon: 'Zap', status: 'active' },

  // Extra Modules
  { id: 'global-news', name: 'GlobalNews', description: 'Automated news aggregation', tier: 0, icon: 'Globe', status: 'active' },
  { id: 'gig-connect', name: 'GigConnect', description: 'Jobs, internships & CVs', tier: 0, icon: 'Briefcase', status: 'active' },
  { id: 'autolife', name: 'Autolife', description: 'YouTube automation engine', tier: 0, icon: 'Video', status: 'active' },
  { id: 'global-boost', name: 'GlobalBoost', description: 'Marketing ROI tracking', tier: 0, icon: 'TrendingUp', status: 'active' },
  { id: 'edu-academy', name: 'Education & Academy', description: 'AI + Human hybrid university', tier: 0, icon: 'GraduationCap', status: 'active' },
  { id: 'edu-store', name: 'EduStore', description: 'Nigerian Academic Marketplace', tier: 0, icon: 'FileText', status: 'active' }
];

export const ICON_MAP: Record<string, any> = {
  Layout, Palette, Box, FileText, Megaphone, Search, Mail, Target, Calendar, Share2, TrendingUp, Code, Film, DraftingCompass, Settings, Briefcase, Globe, Zap, Video, Smartphone, Car, Shirt, Gamepad2, Home, GraduationCap
};

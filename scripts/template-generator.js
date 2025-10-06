// Template Generator for Sonoaac Resume Builder
// This script helps generate new templates easily

class TemplateGenerator {
  constructor() {
    this.templateStyles = ['modern', 'creative', 'professional', 'minimal', 'corporate', 'elegant', 'tech'];
    this.industries = [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales', 
      'Legal', 'Creative', 'Consulting', 'Manufacturing', 'Retail', 'Hospitality',
      'Real Estate', 'Insurance', 'Government', 'Non-Profit', 'Media', 'Sports',
      'Entertainment', 'Transportation', 'Energy', 'Telecommunications'
    ];
    this.categories = [
      'tech', 'healthcare', 'finance', 'education', 'marketing', 'sales',
      'legal', 'creative', 'consulting', 'corporate', 'academic', 'universal'
    ];
  }

  // Generate a new template with random data
  generateTemplate() {
    const style = this.getRandomItem(this.templateStyles);
    const industry = this.getRandomItem(this.industries);
    const category = this.getCategoryFromIndustry(industry);
    
    const names = [
      'Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emma Wilson', 'David Kim',
      'Lisa Thompson', 'James Anderson', 'Maria Garcia', 'Robert Wilson', 'Jennifer Lee',
      'Christopher Brown', 'Amanda Davis', 'Ryan Kim', 'Isabella Martinez', 'Mark Johnson'
    ];
    
    const titles = [
      'Software Engineer', 'Marketing Manager', 'Data Analyst', 'Project Manager',
      'Sales Representative', 'UX Designer', 'Financial Analyst', 'Content Writer',
      'DevOps Engineer', 'Product Manager', 'Business Analyst', 'Graphic Designer',
      'Account Executive', 'Research Scientist', 'Operations Manager'
    ];
    
    const companies = [
      'Tech Corp', 'Global Solutions', 'Innovation Labs', 'Digital Agency',
      'Enterprise Systems', 'Startup Inc', 'Consulting Firm', 'Media Company',
      'Investment Bank', 'Healthcare Systems', 'Education Group', 'Retail Chain'
    ];
    
    const experiences = [
      'Led development of scalable web applications using modern technologies',
      'Managed digital marketing campaigns with 25% ROI increase',
      'Analyzed customer data to drive business insights and growth',
      'Successfully delivered 50+ projects worth $10M+ total value',
      'Exceeded sales targets by 150% for 3 consecutive years',
      'Redesigned user interface improving engagement by 40%',
      'Analyzed financial data and prepared reports for senior management',
      'Created engaging content that increased website traffic by 60%',
      'Automated deployment processes reducing downtime by 90%',
      'Launched 3 successful products with 1M+ users'
    ];
    
    const skills = [
      ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      ['Digital Marketing', 'Analytics', 'SEO', 'Social Media', 'Campaign Management'],
      ['Python', 'SQL', 'Tableau', 'Machine Learning', 'Data Visualization'],
      ['Project Management', 'Agile', 'Scrum', 'Risk Assessment', 'Team Leadership'],
      ['Sales Strategy', 'CRM', 'Negotiation', 'Client Relations', 'Business Development'],
      ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      ['Financial Analysis', 'Excel', 'Risk Assessment', 'Investment Analysis', 'Reporting'],
      ['Content Writing', 'SEO', 'Social Media', 'Copywriting', 'Content Strategy'],
      ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
      ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Roadmapping']
    ];

    const name = this.getRandomItem(names);
    const title = this.getRandomItem(titles);
    const company = this.getRandomItem(companies);
    const experience = this.getRandomItem(experiences);
    const skillSet = this.getRandomItem(skills);

    return {
      id: this.generateId(name, title),
      name: `${this.capitalizeFirst(style)} ${industry}`,
      category: category,
      industry: industry,
      description: `${this.getStyleDescription(style)} perfect for ${industry.toLowerCase()} professionals.`,
      tags: this.generateTags(style, industry, category),
      style: style,
      preview: {
        name: name,
        title: title,
        company: company,
        experience: experience,
        skills: skillSet
      }
    };
  }

  // Generate multiple templates
  generateTemplates(count = 10) {
    const templates = [];
    for (let i = 0; i < count; i++) {
      templates.push(this.generateTemplate());
    }
    return templates;
  }

  // Helper methods
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getCategoryFromIndustry(industry) {
    const mapping = {
      'Technology': 'tech',
      'Healthcare': 'healthcare',
      'Finance': 'finance',
      'Education': 'education',
      'Marketing': 'marketing',
      'Sales': 'sales',
      'Legal': 'legal',
      'Creative': 'creative',
      'Consulting': 'consulting',
      'Manufacturing': 'corporate',
      'Retail': 'corporate',
      'Hospitality': 'corporate',
      'Real Estate': 'corporate',
      'Insurance': 'corporate',
      'Government': 'corporate',
      'Non-Profit': 'corporate',
      'Media': 'creative',
      'Sports': 'creative',
      'Entertainment': 'creative',
      'Transportation': 'corporate',
      'Energy': 'corporate',
      'Telecommunications': 'tech'
    };
    return mapping[industry] || 'universal';
  }

  generateId(name, title) {
    return `${name.toLowerCase().replace(' ', '-')}-${title.toLowerCase().replace(' ', '-')}`;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getStyleDescription(style) {
    const descriptions = {
      'modern': 'Clean, modern design',
      'creative': 'Bold and colorful design',
      'professional': 'Traditional professional format',
      'minimal': 'Simple and elegant design',
      'corporate': 'Formal corporate layout',
      'elegant': 'Sophisticated design with serif fonts',
      'tech': 'Modern dark theme'
    };
    return descriptions[style] || 'Professional design';
  }

  generateTags(style, industry, category) {
    const baseTags = [this.capitalizeFirst(style)];
    
    // Add industry-specific tags
    if (industry === 'Technology') baseTags.push('Tech', 'ATS-Friendly');
    else if (industry === 'Healthcare') baseTags.push('Medical', 'Professional');
    else if (industry === 'Finance') baseTags.push('Analytics', 'Professional');
    else if (industry === 'Education') baseTags.push('Academic', 'Teaching');
    else if (industry === 'Marketing') baseTags.push('Digital', 'Brand');
    else if (industry === 'Sales') baseTags.push('Business Development', 'Client Relations');
    else if (industry === 'Legal') baseTags.push('Law', 'Professional');
    else if (industry === 'Creative') baseTags.push('Design', 'Portfolio');
    else if (industry === 'Consulting') baseTags.push('Advisory', 'Professional');
    else baseTags.push('Professional', 'Universal');
    
    return baseTags.slice(0, 3); // Limit to 3 tags
  }

  // Export templates as JSON
  exportTemplates(templates) {
    return JSON.stringify(templates, null, 2);
  }

  // Import templates from JSON
  importTemplates(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing templates JSON:', error);
      return [];
    }
  }
}

// Usage examples:
// const generator = new TemplateGenerator();
// const newTemplate = generator.generateTemplate();
// const multipleTemplates = generator.generateTemplates(20);
// console.log(generator.exportTemplates(multipleTemplates));

// Make it available globally
window.TemplateGenerator = TemplateGenerator;

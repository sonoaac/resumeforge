// Template System for Sonoaac Resume Builder
// This system allows for easy addition of 50+ templates

class TemplateSystem {
  constructor() {
    this.templates = [];
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.loadTemplates();
    this.renderTemplates();
    this.setupEventListeners();
  }

  loadTemplates() {
    // Base templates with different styles and industries
    this.templates = [
      // Modern Templates
      {
        id: 'modern',
        name: 'Modern',
        category: 'tech',
        industry: 'Technology',
        description: 'Clean, minimal design perfect for tech professionals and modern industries.',
        tags: ['Tech', 'Modern', 'ATS-Friendly'],
        style: 'modern',
        preview: {
          name: 'Sarah Johnson',
          title: 'Software Engineer',
          company: 'Tech Corp',
          experience: 'Led development of web applications using React and Node.js',
          skills: ['JavaScript', 'React', 'Node.js']
        }
      },
      {
        id: 'modern-executive',
        name: 'Modern Executive',
        category: 'executive',
        industry: 'Leadership',
        description: 'Premium modern design for C-level executives and senior leadership.',
        tags: ['Executive', 'Leadership', 'Premium'],
        style: 'modern',
        preview: {
          name: 'James Anderson',
          title: 'Chief Executive Officer',
          company: 'Fortune 500 Company',
          experience: 'Led company through digital transformation and 300% growth',
          skills: ['Strategic Planning', 'Leadership', 'Digital Transformation']
        }
      },
      {
        id: 'modern-startup',
        name: 'Startup Modern',
        category: 'tech',
        industry: 'Startups',
        description: 'Dynamic modern template perfect for startup professionals.',
        tags: ['Startup', 'Tech', 'Dynamic'],
        style: 'modern',
        preview: {
          name: 'Alex Chen',
          title: 'Product Manager',
          company: 'Tech Startup',
          experience: 'Launched 3 successful products with 1M+ users',
          skills: ['Product Management', 'Agile', 'User Research']
        }
      },

      // Creative Templates
      {
        id: 'creative',
        name: 'Creative',
        category: 'creative',
        industry: 'Design',
        description: 'Bold and colorful design perfect for creative professionals and designers.',
        tags: ['Creative', 'Design', 'Portfolio'],
        style: 'creative',
        preview: {
          name: 'Alex Rivera',
          title: 'UX Designer',
          company: 'Startup Inc',
          experience: 'Redesigned user interface improving engagement by 40%',
          skills: ['Figma', 'Adobe XD', 'User Research']
        }
      },
      {
        id: 'creative-marketing',
        name: 'Creative Marketing',
        category: 'marketing',
        industry: 'Marketing',
        description: 'Dynamic creative design for marketing professionals and brand managers.',
        tags: ['Marketing', 'Brand', 'Digital'],
        style: 'creative',
        preview: {
          name: 'Maria Garcia',
          title: 'Marketing Director',
          company: 'Global Agency',
          experience: 'Increased brand awareness by 150% across digital channels',
          skills: ['Digital Marketing', 'Brand Strategy', 'Campaign Management']
        }
      },
      {
        id: 'creative-artist',
        name: 'Artist Portfolio',
        category: 'creative',
        industry: 'Arts',
        description: 'Expressive design perfect for artists and creative professionals.',
        tags: ['Art', 'Portfolio', 'Creative'],
        style: 'creative',
        preview: {
          name: 'Emma Rodriguez',
          title: 'Visual Artist',
          company: 'Art Gallery',
          experience: 'Exhibited work in 15+ galleries worldwide',
          skills: ['Digital Art', 'Traditional Media', 'Exhibition Design']
        }
      },

      // Professional Templates
      {
        id: 'professional',
        name: 'Professional',
        category: 'business',
        industry: 'Business',
        description: 'Traditional format perfect for corporate environments and business professionals.',
        tags: ['Business', 'Corporate', 'Traditional'],
        style: 'professional',
        preview: {
          name: 'Michael Chen',
          title: 'Marketing Manager',
          company: 'Business Solutions Ltd',
          experience: 'Managed digital marketing campaigns with 25% ROI increase',
          skills: ['Digital Marketing', 'Analytics', 'Team Leadership']
        }
      },
      {
        id: 'professional-finance',
        name: 'Finance Professional',
        category: 'finance',
        industry: 'Finance',
        description: 'Formal layout perfect for financial professionals and analysts.',
        tags: ['Finance', 'Analytics', 'Professional'],
        style: 'professional',
        preview: {
          name: 'David Thompson',
          title: 'Financial Analyst',
          company: 'Investment Bank',
          experience: 'Analyzed financial data and prepared reports for senior management',
          skills: ['Financial Analysis', 'Excel', 'Risk Assessment']
        }
      },
      {
        id: 'professional-legal',
        name: 'Legal Professional',
        category: 'legal',
        industry: 'Legal',
        description: 'Formal template designed for legal professionals and attorneys.',
        tags: ['Legal', 'Law', 'Professional'],
        style: 'professional',
        preview: {
          name: 'Jennifer Lee',
          title: 'Corporate Attorney',
          company: 'Law Firm',
          experience: 'Successfully handled 100+ corporate legal matters',
          skills: ['Corporate Law', 'Contract Negotiation', 'Legal Research']
        }
      },

      // Minimal Templates
      {
        id: 'minimal',
        name: 'Minimal',
        category: 'universal',
        industry: 'Universal',
        description: 'Simple and elegant design perfect for any profession and industry.',
        tags: ['Universal', 'Clean', 'Simple'],
        style: 'minimal',
        preview: {
          name: 'Emma Wilson',
          title: 'Data Analyst',
          company: 'Analytics Co',
          experience: 'Analyzed customer data to drive business insights',
          skills: ['Python', 'SQL', 'Tableau', 'Machine Learning']
        }
      },
      {
        id: 'minimal-academic',
        name: 'Academic Minimal',
        category: 'academic',
        industry: 'Education',
        description: 'Clean minimal design perfect for academic professionals.',
        tags: ['Academic', 'Education', 'Research'],
        style: 'minimal',
        preview: {
          name: 'Dr. Robert Wilson',
          title: 'Research Scientist',
          company: 'Research Institute',
          experience: 'Published 25+ peer-reviewed papers in top-tier journals',
          skills: ['Research', 'Data Analysis', 'Scientific Writing']
        }
      },

      // Corporate Templates
      {
        id: 'corporate',
        name: 'Corporate',
        category: 'corporate',
        industry: 'Corporate',
        description: 'Formal layout perfect for financial, legal, and corporate environments.',
        tags: ['Finance', 'Legal', 'Formal'],
        style: 'corporate',
        preview: {
          name: 'David Thompson',
          title: 'Financial Analyst',
          company: 'Investment Bank',
          experience: 'Analyzed financial data and prepared reports for senior management',
          skills: ['Financial Analysis', 'Excel', 'Risk Assessment']
        }
      },
      {
        id: 'corporate-consulting',
        name: 'Consulting Corporate',
        category: 'consulting',
        industry: 'Consulting',
        description: 'Professional corporate template for consultants and advisors.',
        tags: ['Consulting', 'Advisory', 'Professional'],
        style: 'corporate',
        preview: {
          name: 'Lisa Thompson',
          title: 'Senior Consultant',
          company: 'Consulting Firm',
          experience: 'Successfully delivered 50+ projects worth $10M+ total value',
          skills: ['Project Management', 'Strategic Planning', 'Client Relations']
        }
      },

      // Elegant Templates
      {
        id: 'elegant',
        name: 'Elegant',
        category: 'academic',
        industry: 'Writing',
        description: 'Sophisticated design with serif fonts perfect for writers and academics.',
        tags: ['Writing', 'Academic', 'Elegant'],
        style: 'elegant',
        preview: {
          name: 'Isabella Martinez',
          title: 'Content Writer',
          company: 'Media Company',
          experience: 'Created engaging content that increased website traffic by 60%',
          skills: ['Content Writing', 'SEO', 'Social Media']
        }
      },
      {
        id: 'elegant-publishing',
        name: 'Publishing Elegant',
        category: 'publishing',
        industry: 'Publishing',
        description: 'Sophisticated template for publishing and media professionals.',
        tags: ['Publishing', 'Media', 'Elegant'],
        style: 'elegant',
        preview: {
          name: 'Dr. Sarah Williams',
          title: 'Editor',
          company: 'Publishing House',
          experience: 'Edited 200+ manuscripts for major publishing house',
          skills: ['Editing', 'Proofreading', 'Content Strategy']
        }
      },

      // Tech Templates
      {
        id: 'tech',
        name: 'Tech',
        category: 'tech',
        industry: 'Technology',
        description: 'Modern dark theme perfect for developers and tech professionals.',
        tags: ['Developer', 'Tech', 'Modern'],
        style: 'tech',
        preview: {
          name: 'Ryan Kim',
          title: 'Full Stack Developer',
          company: 'Tech Startup',
          experience: 'Built scalable web applications using React, Node.js, and AWS',
          skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker']
        }
      },
      {
        id: 'tech-data',
        name: 'Data Science Tech',
        category: 'tech',
        industry: 'Data Science',
        description: 'Technical template designed for data scientists and AI professionals.',
        tags: ['Data Science', 'AI/ML', 'Technical'],
        style: 'tech',
        preview: {
          name: 'David Kim',
          title: 'Data Scientist',
          company: 'AI Startup',
          experience: 'Built ML models that improved business outcomes by 40%',
          skills: ['Python', 'R', 'TensorFlow', 'SQL', 'AWS', 'Machine Learning']
        }
      },
      {
        id: 'tech-devops',
        name: 'DevOps Tech',
        category: 'tech',
        industry: 'DevOps',
        description: 'Technical template for DevOps engineers and system administrators.',
        tags: ['DevOps', 'Infrastructure', 'Technical'],
        style: 'tech',
        preview: {
          name: 'Mark Johnson',
          title: 'DevOps Engineer',
          company: 'Cloud Company',
          experience: 'Automated deployment processes reducing downtime by 90%',
          skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD']
        }
      },

      // Healthcare Templates
      {
        id: 'healthcare',
        name: 'Healthcare',
        category: 'healthcare',
        industry: 'Healthcare',
        description: 'Professional format designed specifically for healthcare professionals.',
        tags: ['Healthcare', 'Medical', 'Professional'],
        style: 'professional',
        preview: {
          name: 'Dr. Sarah Williams',
          title: 'Registered Nurse',
          company: 'City General Hospital',
          experience: 'Provided comprehensive patient care in emergency department',
          skills: ['Patient Care', 'Emergency Medicine', 'BLS', 'ACLS']
        }
      },
      {
        id: 'healthcare-physician',
        name: 'Physician',
        category: 'healthcare',
        industry: 'Medicine',
        description: 'Professional template for physicians and medical doctors.',
        tags: ['Medicine', 'Physician', 'Medical'],
        style: 'professional',
        preview: {
          name: 'Dr. Michael Brown',
          title: 'Internal Medicine Physician',
          company: 'Medical Center',
          experience: 'Diagnosed and treated complex medical conditions',
          skills: ['Internal Medicine', 'Diagnosis', 'Patient Care', 'Medical Research']
        }
      },

      // Sales Templates
      {
        id: 'sales',
        name: 'Sales Professional',
        category: 'sales',
        industry: 'Sales',
        description: 'Dynamic template designed for sales professionals and account managers.',
        tags: ['Sales', 'Account Management', 'Business Development'],
        style: 'creative',
        preview: {
          name: 'John Smith',
          title: 'Sales Manager',
          company: 'Sales Corp',
          experience: 'Exceeded sales targets by 150% for 3 consecutive years',
          skills: ['Sales Strategy', 'CRM', 'Negotiation', 'Client Relations']
        }
      },
      {
        id: 'sales-enterprise',
        name: 'Enterprise Sales',
        category: 'sales',
        industry: 'Enterprise Sales',
        description: 'Professional template for enterprise sales and business development.',
        tags: ['Enterprise Sales', 'B2B', 'Strategic Sales'],
        style: 'professional',
        preview: {
          name: 'Amanda Davis',
          title: 'Enterprise Account Executive',
          company: 'Enterprise Solutions',
          experience: 'Closed $50M+ in enterprise deals over 2 years',
          skills: ['Enterprise Sales', 'Strategic Planning', 'Relationship Building']
        }
      },

      // Education Templates
      {
        id: 'education',
        name: 'Education',
        category: 'education',
        industry: 'Education',
        description: 'Professional template designed for educators and academic professionals.',
        tags: ['Education', 'Teaching', 'Academic'],
        style: 'professional',
        preview: {
          name: 'Dr. Emily Johnson',
          title: 'Professor of Computer Science',
          company: 'University',
          experience: 'Published 30+ research papers and mentored 50+ students',
          skills: ['Teaching', 'Research', 'Curriculum Development', 'Mentoring']
        }
      },
      {
        id: 'education-k12',
        name: 'K-12 Education',
        category: 'education',
        industry: 'K-12 Education',
        description: 'Template designed for K-12 teachers and educational administrators.',
        tags: ['K-12', 'Teaching', 'Education'],
        style: 'minimal',
        preview: {
          name: 'Ms. Jennifer Adams',
          title: 'Elementary School Teacher',
          company: 'Public School District',
          experience: 'Improved student test scores by 25% through innovative teaching methods',
          skills: ['Curriculum Development', 'Classroom Management', 'Student Assessment']
        }
      },

      // Additional templates can be easily added here...
      // The system is designed to scale to 50+ templates
    ];
  }

  renderTemplates() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;

    // Clear existing content
    grid.innerHTML = '';

    // Filter templates based on current filter
    const filteredTemplates = this.currentFilter === 'all' 
      ? this.templates 
      : this.templates.filter(template => template.category === this.currentFilter);

    // Render templates
    filteredTemplates.forEach((template, index) => {
      const templateCard = this.createTemplateCard(template, index);
      grid.appendChild(templateCard);
    });

    // Add "See More" button if there are more templates
    if (this.templates.length > 8) {
      this.addSeeMoreButton();
    }
  }

  createTemplateCard(template, index) {
    const card = document.createElement('div');
    card.className = `template-card ${index >= 8 ? 'additional-template' : ''}`;
    card.style.display = index >= 8 ? 'none' : 'block';

    card.innerHTML = `
      <div class="template-preview ${template.style}-template">
        ${this.generatePreviewHTML(template)}
      </div>
      <div class="template-info">
        <h3>${template.name}</h3>
        <p>${template.description}</p>
        <div class="template-tags">
          ${template.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
        </div>
        <div class="template-actions">
          <a href="builder.html?template=${template.id}" class="btn btn-primary">Use Template</a>
          <a href="#" class="btn btn-outline" onclick="previewTemplate('${template.id}')">Preview</a>
        </div>
      </div>
    `;

    return card;
  }

  generatePreviewHTML(template) {
    const preview = template.preview;
    
    switch (template.style) {
      case 'modern':
        return `
          <div class="preview-header">
            <div class="preview-logo">${template.name.toUpperCase()}</div>
            <div class="preview-badge">${template.industry}</div>
          </div>
          <div class="preview-content">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-section">
              <div class="preview-section-title">EXPERIENCE</div>
              <div class="preview-item">
                <div class="preview-job-title">${preview.title}</div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
            <div class="preview-section">
              <div class="preview-section-title">SKILLS</div>
              <div class="preview-skills">
                ${preview.skills.map(skill => `<span class="preview-skill">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
        `;
      
      case 'creative':
        return `
          <div class="preview-sidebar">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-contact">${preview.name.toLowerCase().replace(' ', '.')}@email.com</div>
            <div class="preview-skills">
              ${preview.skills.slice(0, 2).map(skill => `<span class="preview-skill">${skill}</span>`).join('')}
            </div>
          </div>
          <div class="preview-main">
            <div class="preview-section">
              <div class="preview-section-title">PORTFOLIO</div>
              <div class="preview-item">
                <div class="preview-job-title">${preview.title}</div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
          </div>
        `;
      
      case 'professional':
        return `
          <div class="preview-header">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-contact">${preview.name.toLowerCase().replace(' ', '.')}@email.com | (555) 123-4567</div>
          </div>
          <div class="preview-content">
            <div class="preview-section">
              <div class="preview-section-title">PROFESSIONAL EXPERIENCE</div>
              <div class="preview-item">
                <div class="preview-job-title">${preview.title}</div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-date">2019 - Present</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
            <div class="preview-section">
              <div class="preview-section-title">EDUCATION</div>
              <div class="preview-item">
                <div class="preview-job-title">Bachelor's Degree</div>
                <div class="preview-company">University</div>
                <div class="preview-date">2018 - 2020</div>
              </div>
            </div>
          </div>
        `;
      
      case 'minimal':
        return `
          <div class="preview-header">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-contact">${preview.name.toLowerCase().replace(' ', '.')}@email.com • (555) 456-7890</div>
          </div>
          <div class="preview-content">
            <div class="preview-section">
              <div class="preview-section-title">EXPERIENCE</div>
              <div class="preview-item">
                <div class="preview-job-title">${preview.title}</div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-date">2021 - Present</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
            <div class="preview-section">
              <div class="preview-section-title">SKILLS</div>
              <div class="preview-skills-text">${preview.skills.join(' • ')}</div>
            </div>
          </div>
        `;
      
      case 'corporate':
        return `
          <div class="preview-header">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-contact">${preview.name.toLowerCase().replace(' ', '.')}@email.com | (555) 321-9876</div>
          </div>
          <div class="preview-content">
            <div class="preview-section">
              <div class="preview-section-title">WORK EXPERIENCE</div>
              <div class="preview-item">
                <div class="preview-item-header">
                  <span class="preview-job-title">${preview.title}</span>
                  <span class="preview-date">2019 - Present</span>
                </div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
            <div class="preview-section">
              <div class="preview-section-title">CERTIFICATIONS</div>
              <div class="preview-item">
                <div class="preview-item-header">
                  <span class="preview-job-title">Professional Certification</span>
                  <span class="preview-date">2021</span>
                </div>
              </div>
            </div>
          </div>
        `;
      
      case 'elegant':
        return `
          <div class="preview-header">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-contact">${preview.name.toLowerCase().replace(' ', '.')}@email.com | (555) 123-4567</div>
          </div>
          <div class="preview-content">
            <div class="preview-section">
              <div class="preview-section-title">WRITING EXPERIENCE</div>
              <div class="preview-item">
                <div class="preview-job-title">${preview.title}</div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-date">2020 - Present</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
            <div class="preview-section">
              <div class="preview-section-title">PUBLICATIONS</div>
              <div class="preview-item">
                <div class="preview-job-title">Featured Articles</div>
                <div class="preview-company">Industry Magazine</div>
                <div class="preview-date">2022 - 2023</div>
              </div>
            </div>
          </div>
        `;
      
      case 'tech':
        return `
          <div class="preview-header">
            <div class="preview-name">${preview.name}</div>
            <div class="preview-title">${preview.title}</div>
            <div class="preview-contact">${preview.name.toLowerCase().replace(' ', '.')}@email.com | (555) 789-0123</div>
          </div>
          <div class="preview-content">
            <div class="preview-section">
              <div class="preview-section-title">TECHNICAL EXPERIENCE</div>
              <div class="preview-item">
                <div class="preview-job-title">${preview.title}</div>
                <div class="preview-company">${preview.company}</div>
                <div class="preview-date">2021 - Present</div>
                <div class="preview-description">${preview.experience}</div>
              </div>
            </div>
            <div class="preview-section">
              <div class="preview-section-title">TECHNOLOGIES</div>
              <div class="preview-skills-text">${preview.skills.join(' • ')}</div>
            </div>
          </div>
        `;
      
      default:
        return `<div class="preview-content"><div class="preview-name">${preview.name}</div><div class="preview-title">${preview.title}</div></div>`;
    }
  }

  addSeeMoreButton() {
    const grid = document.getElementById('templatesGrid');
    const seeMoreSection = document.createElement('div');
    seeMoreSection.className = 'see-more-section';
    seeMoreSection.style.cssText = 'text-align: center; margin-top: 3rem;';
    seeMoreSection.innerHTML = `
      <button class="btn btn-primary" id="seeMoreBtn" onclick="templateSystem.toggleTemplates()">
        See More Templates (${this.templates.length - 8}+ Available)
      </button>
    `;
    grid.parentNode.appendChild(seeMoreSection);
  }

  toggleTemplates() {
    const additionalTemplates = document.querySelectorAll('.additional-template');
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    
    const isHidden = additionalTemplates[0].style.display === 'none';
    
    additionalTemplates.forEach(template => {
      template.style.display = isHidden ? 'block' : 'none';
    });
    
    seeMoreBtn.textContent = isHidden 
      ? 'Show Less' 
      : `See More Templates (${this.templates.length - 8}+ Available)`;
  }

  setupEventListeners() {
    // Add filter functionality
    this.addFilterButtons();
  }

  addFilterButtons() {
    const categories = [...new Set(this.templates.map(t => t.category))];
    const filterContainer = document.createElement('div');
    filterContainer.className = 'template-filters';
    filterContainer.style.cssText = 'text-align: center; margin-bottom: 2rem;';
    
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.textContent = 'All';
    allButton.onclick = () => this.setFilter('all');
    filterContainer.appendChild(allButton);
    
    categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      button.onclick = () => this.setFilter(category);
      filterContainer.appendChild(button);
    });
    
    const templatesSection = document.querySelector('.templates-section .container');
    templatesSection.insertBefore(filterContainer, templatesSection.firstChild);
  }

  setFilter(category) {
    this.currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    this.renderTemplates();
  }
}

// Global functions for template system
function previewTemplate(templateId) {
  // Open template preview in modal or new window
  const template = templateSystem.templates.find(t => t.id === templateId);
  if (template) {
    alert(`Preview for ${template.name} template would open here.`);
    // In a real implementation, this would open a modal with the full template preview
  }
}

// Initialize template system when page loads
let templateSystem;
document.addEventListener('DOMContentLoaded', () => {
  templateSystem = new TemplateSystem();
});

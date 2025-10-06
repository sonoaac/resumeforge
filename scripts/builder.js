// Resume Builder JavaScript

class ResumeBuilder {
    constructor() {
        this.data = {
            personal: {
                fullName: '',
                jobTitle: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                linkedin: '',
                summary: ''
            },
            experience: [],
            education: [],
            skills: {
                technical: '',
                soft: ''
            },
            additional: {
                certifications: '',
                languages: ''
            },
            template: 'modern'
        };
        
        this.currentTemplate = 'modern';
        this.experienceCount = 0;
        this.educationCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.loadSelectedTemplate();
        this.addInitialSections();
        this.updatePreview();
    }
    
    loadSelectedTemplate() {
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const templateFromUrl = urlParams.get('template');
        
        if (templateFromUrl) {
            this.currentTemplate = templateFromUrl;
            this.data.template = templateFromUrl;
            
            // Update template selector
            const templateSelect = document.getElementById('templateSelect');
            if (templateSelect) {
                templateSelect.value = templateFromUrl;
            }
        } else {
            // Fallback to localStorage
            const selectedTemplate = localStorage.getItem('selectedTemplate');
            if (selectedTemplate) {
                this.currentTemplate = selectedTemplate;
                this.data.template = selectedTemplate;
                
                // Update template selector
                const templateSelect = document.getElementById('templateSelect');
                if (templateSelect) {
                    templateSelect.value = selectedTemplate;
                }
                
                // Clear the selected template from localStorage
                localStorage.removeItem('selectedTemplate');
            }
        }
    }
    
    setupEventListeners() {
        // Personal information inputs
        const personalFields = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'website', 'linkedin', 'summary'];
        personalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.data.personal[field] = e.target.value;
                    this.updatePreview();
                    this.autoSave();
                });
            }
        });
        
        // Skills inputs
        const skillFields = ['technicalSkills', 'softSkills'];
        skillFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    const skillType = field === 'technicalSkills' ? 'technical' : 'soft';
                    this.data.skills[skillType] = e.target.value;
                    this.updatePreview();
                    this.autoSave();
                });
            }
        });
        
        // Additional fields
        const additionalFields = ['certifications', 'languages'];
        additionalFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.data.additional[field] = e.target.value;
                    this.updatePreview();
                    this.autoSave();
                });
            }
        });
        
        // Template selector
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                this.currentTemplate = e.target.value;
                this.data.template = e.target.value;
                this.updatePreview();
                this.autoSave();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveResume();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.exportToPDF();
                        break;
                }
            }
        });
    }
    
    loadSavedData() {
        const saved = localStorage.getItem('sonoaacResumeData');
        if (saved) {
            try {
                this.data = { ...this.data, ...JSON.parse(saved) };
                this.populateForm();
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }
    
    populateForm() {
        // Populate personal information
        Object.keys(this.data.personal).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.data.personal[key];
            }
        });
        
        // Populate skills
        const technicalSkillsEl = document.getElementById('technicalSkills');
        const softSkillsEl = document.getElementById('softSkills');
        if (technicalSkillsEl) technicalSkillsEl.value = this.data.skills.technical;
        if (softSkillsEl) softSkillsEl.value = this.data.skills.soft;
        
        // Populate additional
        Object.keys(this.data.additional).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = this.data.additional[key];
            }
        });
        
        // Set template
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.value = this.data.template;
            this.currentTemplate = this.data.template;
        }
    }
    
    addInitialSections() {
        // Add one experience and education section by default
        if (this.data.experience.length === 0) {
            this.addExperience();
        }
        if (this.data.education.length === 0) {
            this.addEducation();
        }
    }
    
    addExperience() {
        const container = document.getElementById('experienceContainer');
        const index = this.experienceCount++;
        
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.setAttribute('data-index', index);
        
        experienceItem.innerHTML = `
            <button class="remove-btn" onclick="resumeBuilder.removeExperience(${index})">
                <i class="fas fa-trash"></i>
                Remove
            </button>
            
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" class="job-title" placeholder="e.g., Senior Software Engineer" required>
            </div>
            
            <div class="form-group">
                <label>Company *</label>
                <input type="text" class="company" placeholder="e.g., Tech Company Inc." required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" class="start-date">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" class="end-date">
                    <div class="checkbox-group">
                        <input type="checkbox" class="current-job" id="current-${index}">
                        <label for="current-${index}">Currently working here</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Location</label>
                <input type="text" class="location" placeholder="e.g., San Francisco, CA">
            </div>
            
            <div class="form-group">
                <label>Description</label>
                <textarea class="description" rows="4" placeholder="Describe your responsibilities and achievements"></textarea>
            </div>
        `;
        
        container.appendChild(experienceItem);
        this.setupExperienceListeners(experienceItem, index);
        
        // Update data
        this.data.experience.push({
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            currentJob: false,
            location: '',
            description: ''
        });
        
        this.updatePreview();
    }
    
    removeExperience(index) {
        const container = document.getElementById('experienceContainer');
        const item = container.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.remove();
            this.data.experience.splice(index, 1);
            this.updatePreview();
            this.autoSave();
        }
    }
    
    setupExperienceListeners(item, index) {
        const inputs = item.querySelectorAll('input, textarea');
        const checkbox = item.querySelector('.current-job');
        
        // Handle current job checkbox
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                const endDateInput = item.querySelector('.end-date');
                if (e.target.checked) {
                    endDateInput.disabled = true;
                    endDateInput.value = '';
                } else {
                    endDateInput.disabled = false;
                }
                this.updateExperienceFromForm(index);
            });
        }
        
        // Handle input changes
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateExperienceFromForm(index);
            });
        });
    }
    
    updateExperienceFromForm(index) {
        const item = document.querySelector(`[data-index="${index}"]`);
        if (!item) return;
        
        const data = {
            jobTitle: item.querySelector('.job-title').value,
            company: item.querySelector('.company').value,
            startDate: item.querySelector('.start-date').value,
            endDate: item.querySelector('.end-date').value,
            currentJob: item.querySelector('.current-job').checked,
            location: item.querySelector('.location').value,
            description: item.querySelector('.description').value
        };
        
        this.data.experience[index] = data;
        this.updatePreview();
        this.autoSave();
    }
    
    addEducation() {
        const container = document.getElementById('educationContainer');
        const index = this.educationCount++;
        
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.setAttribute('data-index', index);
        
        educationItem.innerHTML = `
            <button class="remove-btn" onclick="resumeBuilder.removeEducation(${index})">
                <i class="fas fa-trash"></i>
                Remove
            </button>
            
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" class="degree" placeholder="e.g., Bachelor of Science in Computer Science" required>
            </div>
            
            <div class="form-group">
                <label>Institution *</label>
                <input type="text" class="institution" placeholder="e.g., University of Technology" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" class="start-date">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" class="end-date">
                </div>
            </div>
            
            <div class="form-group">
                <label>Location</label>
                <input type="text" class="location" placeholder="e.g., Berkeley, CA">
            </div>
            
            <div class="form-group">
                <label>GPA (Optional)</label>
                <input type="text" class="gpa" placeholder="e.g., 3.8">
            </div>
            
            <div class="form-group">
                <label>Achievements</label>
                <textarea class="achievements" rows="3" placeholder="List any relevant achievements or coursework"></textarea>
            </div>
        `;
        
        container.appendChild(educationItem);
        this.setupEducationListeners(educationItem, index);
        
        // Update data
        this.data.education.push({
            degree: '',
            institution: '',
            startDate: '',
            endDate: '',
            location: '',
            gpa: '',
            achievements: ''
        });
        
        this.updatePreview();
    }
    
    removeEducation(index) {
        const container = document.getElementById('educationContainer');
        const item = container.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.remove();
            this.data.education.splice(index, 1);
            this.updatePreview();
            this.autoSave();
        }
    }
    
    setupEducationListeners(item, index) {
        const inputs = item.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateEducationFromForm(index);
            });
        });
    }
    
    updateEducationFromForm(index) {
        const item = document.querySelector(`[data-index="${index}"]`);
        if (!item) return;
        
        const data = {
            degree: item.querySelector('.degree').value,
            institution: item.querySelector('.institution').value,
            startDate: item.querySelector('.start-date').value,
            endDate: item.querySelector('.end-date').value,
            location: item.querySelector('.location').value,
            gpa: item.querySelector('.gpa').value,
            achievements: item.querySelector('.achievements').value
        };
        
        this.data.education[index] = data;
        this.updatePreview();
        this.autoSave();
    }
    
    updatePreview() {
        const previewContainer = document.getElementById('resumePreview');
        if (!previewContainer) return;
        
        const resumeHTML = this.generateResumeHTML();
        previewContainer.innerHTML = resumeHTML;
        previewContainer.className = `resume-preview ${this.currentTemplate}`;
    }
    
    generateResumeHTML() {
        const data = this.data;
        
        switch(this.currentTemplate) {
            case 'modern':
                return this.generateModernTemplate(data);
            case 'creative':
                return this.generateCreativeTemplate(data);
            case 'professional':
                return this.generateProfessionalTemplate(data);
            case 'minimal':
                return this.generateMinimalTemplate(data);
            case 'corporate':
                return this.generateCorporateTemplate(data);
            default:
                return this.generateModernTemplate(data);
        }
    }
    
    generateModernTemplate(data) {
        return `
            <div class="modern-resume">
                <div class="header">
                    <div class="name">${data.personal.fullName || 'Your Name'}</div>
                    <div class="title">${data.personal.jobTitle || 'Your Job Title'}</div>
                    <div class="contact">
                        ${data.personal.email ? `<span>📧 ${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
                        ${data.personal.website ? `<span>🌐 ${data.personal.website}</span>` : ''}
                        ${data.personal.linkedin ? `<span>🔗 ${data.personal.linkedin}</span>` : ''}
                    </div>
                </div>
                
                ${data.personal.summary ? `
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <div class="summary">${data.personal.summary}</div>
                </div>
                ` : ''}
                
                ${data.experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Work Experience</div>
                    ${data.experience.map(exp => `
                        <div class="item">
                            <div class="item-header">
                                <div>
                                    <div class="item-title">${exp.jobTitle || 'Job Title'}</div>
                                    <div class="item-company">${exp.company || 'Company Name'}</div>
                                    ${exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                                </div>
                                <div class="item-date">
                                    ${this.formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : this.formatDate(exp.endDate)}
                                </div>
                            </div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    ${data.education.map(edu => `
                        <div class="item">
                            <div class="item-header">
                                <div>
                                    <div class="item-title">${edu.degree || 'Degree'}</div>
                                    <div class="item-company">${edu.institution || 'Institution'}</div>
                                    ${edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
                                </div>
                                <div class="item-date">
                                    ${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}
                                </div>
                            </div>
                            ${edu.gpa ? `<div class="item-description">GPA: ${edu.gpa}</div>` : ''}
                            ${edu.achievements ? `<div class="item-description">${edu.achievements}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.skills.technical || data.skills.soft ? `
                <div class="section">
                    <div class="section-title">Skills</div>
                    <div class="skills">
                        ${data.skills.technical ? data.skills.technical.split(',').map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('') : ''}
                        ${data.skills.soft ? data.skills.soft.split(',').map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('') : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    generateCreativeTemplate(data) {
        return `
            <div class="creative-resume">
                <div class="sidebar">
                    <div class="profile">
                        <div class="name">${data.personal.fullName || 'Your Name'}</div>
                        <div class="title">${data.personal.jobTitle || 'Your Job Title'}</div>
                    </div>
                    
                    <div class="contact-info">
                        ${data.personal.email ? `<div class="contact-item">📧 ${data.personal.email}</div>` : ''}
                        ${data.personal.phone ? `<div class="contact-item">📱 ${data.personal.phone}</div>` : ''}
                        ${data.personal.location ? `<div class="contact-item">📍 ${data.personal.location}</div>` : ''}
                        ${data.personal.website ? `<div class="contact-item">🌐 ${data.personal.website}</div>` : ''}
                        ${data.personal.linkedin ? `<div class="contact-item">🔗 ${data.personal.linkedin}</div>` : ''}
                    </div>
                    
                    ${data.skills.technical || data.skills.soft ? `
                    <div class="skills-section">
                        <h3>Skills</h3>
                        <div class="skills">
                            ${data.skills.technical ? data.skills.technical.split(',').map(skill => 
                                `<span class="skill-tag">${skill.trim()}</span>`
                            ).join('') : ''}
                            ${data.skills.soft ? data.skills.soft.split(',').map(skill => 
                                `<span class="skill-tag">${skill.trim()}</span>`
                            ).join('') : ''}
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="main-content">
                    ${data.personal.summary ? `
                    <div class="section">
                        <h2>About Me</h2>
                        <p class="summary">${data.personal.summary}</p>
                    </div>
                    ` : ''}
                    
                    ${data.experience.length > 0 ? `
                    <div class="section">
                        <h2>Experience</h2>
                        ${data.experience.map(exp => `
                            <div class="experience-item">
                                <div class="job-title">${exp.jobTitle || 'Job Title'}</div>
                                <div class="company">${exp.company || 'Company Name'}</div>
                                <div class="date">${this.formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : this.formatDate(exp.endDate)}</div>
                                ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${data.education.length > 0 ? `
                    <div class="section">
                        <h2>Education</h2>
                        ${data.education.map(edu => `
                            <div class="education-item">
                                <div class="degree">${edu.degree || 'Degree'}</div>
                                <div class="institution">${edu.institution || 'Institution'}</div>
                                <div class="date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</div>
                                ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    generateProfessionalTemplate(data) {
        return `
            <div class="professional-resume">
                <div class="header">
                    <div class="name">${data.personal.fullName || 'Your Name'}</div>
                    <div class="title">${data.personal.jobTitle || 'Your Job Title'}</div>
                    <div class="contact">
                        ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
                        ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
                        ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
                    </div>
                </div>
                
                ${data.personal.summary ? `
                <div class="section">
                    <div class="section-title">Executive Summary</div>
                    <div class="summary">${data.personal.summary}</div>
                </div>
                ` : ''}
                
                ${data.experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Professional Experience</div>
                    ${data.experience.map(exp => `
                        <div class="item">
                            <div class="item-title">${exp.jobTitle || 'Job Title'}</div>
                            <div class="item-company">${exp.company || 'Company Name'}</div>
                            <div class="item-date">${this.formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : this.formatDate(exp.endDate)}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    ${data.education.map(edu => `
                        <div class="item">
                            <div class="item-title">${edu.degree || 'Degree'}</div>
                            <div class="item-company">${edu.institution || 'Institution'}</div>
                            <div class="item-date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.skills.technical || data.skills.soft ? `
                <div class="section">
                    <div class="section-title">Core Competencies</div>
                    <div class="competencies">
                        ${data.skills.technical ? data.skills.technical.split(',').map(skill => 
                            `<span class="competency">${skill.trim()}</span>`
                        ).join('') : ''}
                        ${data.skills.soft ? data.skills.soft.split(',').map(skill => 
                            `<span class="competency">${skill.trim()}</span>`
                        ).join('') : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    generateMinimalTemplate(data) {
        return `
            <div class="minimal-resume">
                <div class="header">
                    <div class="name">${data.personal.fullName || 'Your Name'}</div>
                    <div class="title">${data.personal.jobTitle || 'Your Job Title'}</div>
                    <div class="contact">
                        ${data.personal.email} • ${data.personal.phone} • ${data.personal.location}
                    </div>
                </div>
                
                ${data.personal.summary ? `
                <div class="section">
                    <div class="summary">${data.personal.summary}</div>
                </div>
                ` : ''}
                
                ${data.experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Experience</div>
                    ${data.experience.map(exp => `
                        <div class="item">
                            <div class="item-title">${exp.jobTitle || 'Job Title'}</div>
                            <div class="item-company">${exp.company || 'Company Name'}</div>
                            <div class="item-date">${this.formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : this.formatDate(exp.endDate)}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    ${data.education.map(edu => `
                        <div class="item">
                            <div class="item-title">${edu.degree || 'Degree'}</div>
                            <div class="item-company">${edu.institution || 'Institution'}</div>
                            <div class="item-date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.skills.technical || data.skills.soft ? `
                <div class="section">
                    <div class="section-title">Skills</div>
                    <div class="skills">
                        ${data.skills.technical ? data.skills.technical.split(',').map(skill => 
                            `<span class="skill">${skill.trim()}</span>`
                        ).join(' • ') : ''}
                        ${data.skills.soft ? data.skills.soft.split(',').map(skill => 
                            `<span class="skill">${skill.trim()}</span>`
                        ).join(' • ') : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    generateCorporateTemplate(data) {
        return `
            <div class="corporate-resume">
                <div class="header">
                    <div class="name">${data.personal.fullName || 'Your Name'}</div>
                    <div class="title">${data.personal.jobTitle || 'Your Job Title'}</div>
                    <div class="contact">
                        ${data.personal.email} | ${data.personal.phone} | ${data.personal.location}
                    </div>
                </div>
                
                ${data.personal.summary ? `
                <div class="section">
                    <div class="section-title">Professional Profile</div>
                    <div class="summary">${data.personal.summary}</div>
                </div>
                ` : ''}
                
                ${data.experience.length > 0 ? `
                <div class="section">
                    <div class="section-title">Work Experience</div>
                    ${data.experience.map(exp => `
                        <div class="item">
                            <div class="item-header">
                                <div class="item-title">${exp.jobTitle || 'Job Title'}</div>
                                <div class="item-date">${this.formatDate(exp.startDate)} - ${exp.currentJob ? 'Present' : this.formatDate(exp.endDate)}</div>
                            </div>
                            <div class="item-company">${exp.company || 'Company Name'}</div>
                            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.education.length > 0 ? `
                <div class="section">
                    <div class="section-title">Education</div>
                    ${data.education.map(edu => `
                        <div class="item">
                            <div class="item-header">
                                <div class="item-title">${edu.degree || 'Degree'}</div>
                                <div class="item-date">${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}</div>
                            </div>
                            <div class="item-company">${edu.institution || 'Institution'}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.additional.certifications ? `
                <div class="section">
                    <div class="section-title">Certifications</div>
                    <div class="certifications">${data.additional.certifications}</div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    autoSave() {
        localStorage.setItem('sonoaacResumeData', JSON.stringify(this.data));
    }
    
    saveResume() {
        this.autoSave();
        this.showNotification('Resume saved successfully!', 'success');
    }
    
    exportToPDF() {
        const element = document.getElementById('resumePreview');
        const button = document.querySelector('.btn-primary');
        
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
            button.disabled = true;
        }
        
        // Use html2canvas and jsPDF
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save('resume.pdf');
            
            if (button) {
                button.innerHTML = '<i class="fas fa-download"></i> Export PDF';
                button.disabled = false;
            }
            
            this.showNotification('Resume exported successfully!', 'success');
        }).catch(error => {
            console.error('Error exporting PDF:', error);
            this.showNotification('Error exporting PDF. Please try again.', 'error');
            
            if (button) {
                button.innerHTML = '<i class="fas fa-download"></i> Export PDF';
                button.disabled = false;
            }
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 
                        type === 'error' ? 'linear-gradient(45deg, #f44336, #da190b)' : 
                        'linear-gradient(45deg, #2196F3, #0b7dda)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
}

// Global functions
function addExperience() {
    resumeBuilder.addExperience();
}

function addEducation() {
    resumeBuilder.addEducation();
}

function removeExperience(index) {
    resumeBuilder.removeExperience(index);
}

function removeEducation(index) {
    resumeBuilder.removeEducation(index);
}

function saveResume() {
    resumeBuilder.saveResume();
}

function exportToPDF() {
    resumeBuilder.exportToPDF();
}

function togglePreview() {
    const previewPanel = document.querySelector('.preview-panel');
    const button = document.querySelector('.btn-small');
    
    if (previewPanel && button) {
        previewPanel.classList.toggle('collapsed');
        
        if (previewPanel.classList.contains('collapsed')) {
            button.innerHTML = '<i class="fas fa-expand-alt"></i> Expand';
        } else {
            button.innerHTML = '<i class="fas fa-compress-alt"></i> Collapse';
        }
    }
}

function printPreview() {
    window.print();
}

function goHome() {
    if (confirm('Are you sure you want to leave? Your progress will be saved.')) {
        window.location.href = 'index.html';
    }
}

function goToTemplates() {
    if (confirm('Are you sure you want to leave? Your progress will be saved.')) {
        window.location.href = 'templates.html';
    }
}

// Add subtle navbar scroll shrink
window.addEventListener("scroll", () => {
    const nav = document.querySelector(".sonoaac-header");
    if (window.scrollY > 60) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
});

// Initialize the resume builder
let resumeBuilder;

document.addEventListener('DOMContentLoaded', () => {
    resumeBuilder = new ResumeBuilder();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-content i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
});
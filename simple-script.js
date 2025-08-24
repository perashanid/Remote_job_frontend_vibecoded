class RemoteJobsHub {
    constructor() {
        this.jobs = [];
        this.filteredJobs = [];
        this.currentPage = 1;
        this.jobsPerPage = 12;

        this.initializeElements();
        this.bindEvents();
        this.loadSampleJobs();
    }

    initializeElements() {
        this.roleInput = document.getElementById('roleInput');
        this.locationInput = document.getElementById('locationInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.sortSelect = document.getElementById('sortBy');
        this.jobsGrid = document.getElementById('jobsGrid');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.loading = document.getElementById('loading');
        this.darkModeToggle = document.getElementById('darkModeToggle');

        this.totalJobsEl = document.getElementById('totalJobs');
        this.totalInternshipsEl = document.getElementById('totalInternships');
        this.totalCompaniesEl = document.getElementById('totalCompanies');
    }

    bindEvents() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (this.roleInput) {
            this.roleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        if (this.locationInput) {
            this.locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.sortJobs());
        }

        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreJobs());
        }

        if (this.darkModeToggle) {
            this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterTab(e));
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        this.initializeDarkMode();
    }

    loadSampleJobs() {
        this.showLoading(true);
        
        // Simulate loading delay
        setTimeout(() => {
            this.jobs = this.generateSampleJobs();
            this.filteredJobs = [...this.jobs];
            this.renderJobs();
            this.updateStats();
            this.showLoading(false);
        }, 1000);
    }

    generateSampleJobs() {
        const companies = [
            'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Airbnb',
            'Stripe', 'Shopify', 'GitHub', 'Slack', 'Zoom', 'Dropbox', 'Adobe', 'Salesforce',
            'Tesla', 'Twitter', 'LinkedIn', 'Uber', 'Discord', 'Figma', 'Notion', 'Canva'
        ];
        
        const roles = [
            'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer',
            'Data Scientist', 'Product Manager', 'DevOps Engineer', 'Mobile Developer',
            'Software Engineer', 'Data Analyst', 'Marketing Manager', 'Content Writer',
            'Customer Success Manager', 'Sales Representative', 'QA Engineer', 'Technical Writer',
            'Machine Learning Engineer', 'Cloud Architect', 'Security Engineer', 'Scrum Master'
        ];
        
        const types = ['full-time', 'part-time', 'internship', 'contract'];
        const locations = ['Remote Worldwide', 'Remote US', 'Remote Europe', 'Remote Asia', 'Remote Americas'];
        
        const skillSets = [
            ['JavaScript', 'React', 'Node.js'],
            ['Python', 'Django', 'PostgreSQL'],
            ['Java', 'Spring', 'AWS'],
            ['TypeScript', 'Vue.js', 'MongoDB'],
            ['React Native', 'iOS', 'Android'],
            ['Figma', 'Sketch', 'Adobe XD'],
            ['SQL', 'Tableau', 'Python'],
            ['Docker', 'Kubernetes', 'CI/CD'],
            ['HTML', 'CSS', 'JavaScript'],
            ['Go', 'Microservices', 'Redis'],
            ['Swift', 'Kotlin', 'Flutter'],
            ['C#', '.NET', 'Azure'],
            ['Ruby', 'Rails', 'Heroku'],
            ['PHP', 'Laravel', 'MySQL']
        ];

        const descriptions = [
            'Join our dynamic team and work on cutting-edge projects that impact millions of users worldwide.',
            'We are looking for a passionate developer to help build the future of our platform.',
            'Exciting opportunity to work with a talented team on innovative solutions.',
            'Be part of a fast-growing company and make a real difference in the industry.',
            'Work remotely with flexible hours and competitive compensation.',
            'Join a collaborative environment where your ideas matter and growth is encouraged.',
            'Help us build products that users love while working with the latest technologies.',
            'Opportunity to work on challenging problems with a supportive and diverse team.',
            'Shape the future of technology while maintaining work-life balance.',
            'Contribute to open-source projects and make an impact on the developer community.'
        ];

        const jobs = [];
        for (let i = 0; i < 30; i++) {
            const company = companies[i % companies.length];
            const role = roles[i % roles.length];
            const type = types[i % types.length];
            const location = locations[i % locations.length];
            const jobSkills = skillSets[i % skillSets.length];
            const description = descriptions[i % descriptions.length];
            
            jobs.push({
                id: 'job_' + i,
                title: role,
                company: company,
                type: type,
                category: this.getJobCategory(role),
                description: description,
                skills: jobSkills,
                postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                salary: this.generateSalary(type),
                location: location,
                applyUrl: `https://careers.${company.toLowerCase().replace(/\s+/g, '')}.com`,
                isRemote: true
            });
        }
        return jobs;
    }

    generateSalary(type) {
        const salaries = {
            'full-time': ['$80,000 - $120,000', '$90,000 - $140,000', '$100,000 - $160,000', '$70,000 - $110,000', '$120,000 - $180,000'],
            'part-time': ['$40,000 - $60,000', '$35,000 - $55,000', '$45,000 - $65,000', '$50,000 - $70,000'],
            'contract': ['$60 - $80/hour', '$70 - $100/hour', '$50 - $75/hour', '$80 - $120/hour'],
            'internship': ['$20 - $30/hour', '$25 - $35/hour', '$30 - $40/hour', 'Paid Internship']
        };
        
        const typeSalaries = salaries[type] || salaries['full-time'];
        return typeSalaries[Math.floor(Math.random() * typeSalaries.length)];
    }

    getJobCategory(title) {
        const t = title.toLowerCase();
        if (t.includes('developer') || t.includes('engineer') || t.includes('programmer')) return 'software-development';
        if (t.includes('design') || t.includes('ui') || t.includes('ux')) return 'design';
        if (t.includes('marketing') || t.includes('seo') || t.includes('social')) return 'marketing';
        if (t.includes('data') || t.includes('analyst') || t.includes('scientist')) return 'data-science';
        if (t.includes('writer') || t.includes('content')) return 'writing';
        if (t.includes('support') || t.includes('service') || t.includes('success')) return 'customer-service';
        if (t.includes('sales') || t.includes('representative')) return 'sales';
        if (t.includes('manager') || t.includes('product')) return 'management';
        return 'software-development';
    }

    performSearch() {
        const roleSearch = this.roleInput ? this.roleInput.value.toLowerCase() : '';
        const locationSearch = this.locationInput ? this.locationInput.value.toLowerCase() : '';

        this.filteredJobs = this.jobs.filter(job => {
            const matchesRole = !roleSearch ||
                job.title.toLowerCase().includes(roleSearch) ||
                job.company.toLowerCase().includes(roleSearch) ||
                job.skills.some(skill => skill.toLowerCase().includes(roleSearch));

            const matchesLocation = !locationSearch ||
                job.location.toLowerCase().includes(locationSearch);

            return matchesRole && matchesLocation;
        });

        this.currentPage = 1;
        this.renderJobs();
        this.updateStats();

        // Scroll to jobs section
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    sortJobs() {
        if (!this.sortSelect) return;
        
        const sortBy = this.sortSelect.value;
        this.filteredJobs.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.postedDate) - new Date(a.postedDate);
                case 'company':
                    return a.company.localeCompare(b.company);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
        this.renderJobs();
    }

    renderJobs() {
        if (!this.jobsGrid) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.jobsPerPage;
        const jobsToShow = this.filteredJobs.slice(startIndex, endIndex);

        this.jobsGrid.innerHTML = '';

        if (jobsToShow.length === 0) {
            this.jobsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
            if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
            return;
        }

        jobsToShow.forEach(job => {
            const card = this.createJobCard(job);
            this.jobsGrid.appendChild(card);
        });

        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = endIndex < this.filteredJobs.length ? 'block' : 'none';
        }
    }

    createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        
        const timeAgo = this.getTimeAgo(job.postedDate);
        const remoteIcon = job.isRemote ? '<i class="fas fa-home" style="color: #10b981; margin-left: 0.5rem;" title="Remote"></i>' : '';

        card.innerHTML = `
            <div class="job-header">
                <div>
                    <div class="job-title">${job.title}${remoteIcon}</div>
                    <div class="company-name">${job.company}</div>
                </div>
                <div class="job-type ${job.type}">${this.formatJobType(job.type)}</div>
            </div>
            
            <div class="job-description">${job.description}</div>
            
            <div class="job-details">
                <div class="job-location">
                    <i class="fas fa-map-marker-alt"></i> ${job.location}
                </div>
                <div class="job-salary">
                    <i class="fas fa-dollar-sign"></i> ${job.salary}
                </div>
            </div>
            
            <div class="job-tags">
                ${job.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
            </div>
            
            <div class="job-footer">
                <div class="job-date">
                    <i class="fas fa-clock"></i> ${timeAgo}
                </div>
                <button class="apply-btn" onclick="window.open('${job.applyUrl}', '_blank')">
                    Apply Now
                </button>
            </div>
        `;

        return card;
    }

    formatJobType(type) {
        const types = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            'internship': 'Internship',
            'contract': 'Contract'
        };
        return types[type] || type;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return diffDays + ' days ago';
        if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
        return Math.floor(diffDays / 30) + ' months ago';
    }

    loadMoreJobs() {
        this.currentPage++;
        this.renderJobs();
    }

    updateStats() {
        if (!this.totalJobsEl) return;

        const totalJobs = this.filteredJobs.filter(job => job.type !== 'internship').length;
        const totalInternships = this.filteredJobs.filter(job => job.type === 'internship').length;
        const totalCompanies = new Set(this.filteredJobs.map(job => job.company)).size;

        this.animateCounter(this.totalJobsEl, totalJobs);
        this.animateCounter(this.totalInternshipsEl, totalInternships);
        this.animateCounter(this.totalCompaniesEl, totalCompanies);
    }

    animateCounter(element, target) {
        const current = parseInt(element.textContent) || 0;
        const increment = Math.ceil((target - current) / 20);

        if (current < target) {
            element.textContent = current + increment;
            setTimeout(() => this.animateCounter(element, target), 50);
        } else {
            element.textContent = target;
        }
    }

    showLoading(show) {
        if (this.loading) this.loading.style.display = show ? 'block' : 'none';
        if (this.jobsGrid) this.jobsGrid.style.display = show ? 'none' : 'grid';
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);

        if (this.darkModeToggle) {
            const icon = this.darkModeToggle.querySelector('i');
            if (isDarkMode) {
                icon.className = 'fas fa-sun';
                this.darkModeToggle.title = 'Switch to Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                this.darkModeToggle.title = 'Switch to Dark Mode';
            }
        }
    }

    initializeDarkMode() {
        const savedDarkMode = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
            document.body.classList.add('dark-mode');
            if (this.darkModeToggle) {
                const icon = this.darkModeToggle.querySelector('i');
                icon.className = 'fas fa-sun';
                this.darkModeToggle.title = 'Switch to Light Mode';
            }
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        
        if (target === '#jobs') {
            this.showAllJobs();
        } else if (target === '#internships') {
            this.showInternships();
        } else if (target === '#about') {
            this.showAbout();
        } else if (target === '#home') {
            // Scroll to top/hero section
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        } else if (target === '#companies') {
            // Scroll to companies section
            document.getElementById('companies').scrollIntoView({ behavior: 'smooth' });
        } else {
            // For any other section, try to find it by ID and scroll to it
            const sectionId = target.replace('#', '');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    showAllJobs() {
        if (this.roleInput) this.roleInput.value = '';
        if (this.locationInput) this.locationInput.value = '';
        this.filteredJobs = [...this.jobs];
        this.currentPage = 1;
        this.renderJobs();
        this.updateStats();
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    }

    showInternships() {
        if (this.roleInput) this.roleInput.value = 'internship';
        if (this.locationInput) this.locationInput.value = '';
        this.filteredJobs = this.jobs.filter(job => job.type === 'internship');
        this.currentPage = 1;
        this.renderJobs();
        this.updateStats();
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    }

    showAbout() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Remote Jobs Hub...');
    new RemoteJobsHub();
});

EXAM_DATA =  {
    'design': {
        'mcqs': [
            {
                'id': 'design-mcq-0',
                'question': 'Which principle describes the relationship between elements that look alike within a design?',
                'options': ['Similarity', 'Proximity', 'Continuation', 'Closure'],
                'correctAnswer': 'Similarity'
            },
            {
                'id': 'design-mcq-1',
                'question': 'What color model should be used when designing for digital screens?',
                'options': ['CMYK', 'RGB', 'Pantone', 'HSL'],
                'correctAnswer': 'RGB'
            },
            {
                'id': 'design-mcq-2',
                'question': 'Which file format is best for logos that need to be scaled to different sizes?',
                'options': ['JPG', 'PNG', 'SVG', 'GIF'],
                'correctAnswer': 'SVG'
            },
            {
                'id': 'design-mcq-3',
                'question': 'What is the recommended minimum font size for body text on web?',
                'options': ['8px', '12px', '16px', '20px'],
                'correctAnswer': '16px'
            },
            {
                'id': 'design-mcq-4',
                'question': 'Which layout principle helps create visual hierarchy?',
                'options': ['Contrast', 'Repetition', 'Alignment', 'Proximity'],
                'correctAnswer': 'Contrast'
            },
            {
                'id': 'design-mcq-5',
                'question': 'What is the purpose of whitespace in design?',
                'options': ['Fill empty areas', 'Improve readability', 'Save space', 'Add decoration'],
                'correctAnswer': 'Improve readability'
            },
            {
                'id': 'design-mcq-6',
                'question': 'Which design pattern is best for displaying large sets of data?',
                'options': ['Carousel', 'Modal', 'Infinite Scroll', 'Accordion'],
                'correctAnswer': 'Infinite Scroll'
            }
        ],
        'descriptive': [
            {
                'id': 'design-desc-1',
                'question': 'Explain how you would approach designing a responsive navigation menu for both mobile and desktop views.',
                'sampleAnswer': 'For a responsive navigation menu, start with a mobile-first approach using a hamburger menu that expands into a full-screen overlay. For desktop, transform it into a horizontal menu bar with dropdowns if needed. Consider touch targets for mobile (min 44px), ensure keyboard accessibility, and maintain visual hierarchy across breakpoints.'
            },
            {
                'id': 'design-desc-2',
                'question': 'Describe how you would create an accessible color scheme for a website while maintaining brand identity.',
                'sampleAnswer': 'Begin by selecting primary colors that meet WCAG 2.1 contrast guidelines (4.5:1 for normal text, 3:1 for large text). Use tools like WebAIM\'s contrast checker. Create a palette with 3-5 main colors and establish clear hierarchy. Test with colorblindness simulators and provide alternative visual indicators beyond color alone.'
            }
        ],
        'domainSpecific': {
            'question': 'Create a high-fidelity prototype for an e-commerce product page following modern design principles. Upload your Figma/Adobe XD design file.',
            'description': 'Your design should include:\n- Product image gallery\n- Product details and pricing\n- Add to cart functionality\n- Related products section\n- Mobile and desktop versions',
            'type': 'design_url',
            'maxScore': 20
        }
    },
    'coding': {
        'mcqs': [
            {
                'id': 'coding-mcq-0',
                'question': 'What is the time complexity of binary search?',
                'options': ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                'correctAnswer': 'O(log n)'
            },
            {
                'id': 'coding-mcq-1',
                'question': 'Which data structure implements LIFO?',
                'options': ['Queue', 'Stack', 'Linked List', 'Array'],
                'correctAnswer': 'Stack'
            },
            {
                'id': 'coding-mcq-2',
                'question': 'What is the primary difference between let and var in JavaScript?',
                'options': ['Type assignment', 'Block scope', 'Hoisting behavior', 'Memory allocation'],
                'correctAnswer': 'Block scope'
            },
            {
                'id': 'coding-mcq-3',
                'question': 'Which sorting algorithm has the best average case time complexity?',
                'options': ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Merge Sort'],
                'correctAnswer': 'Quick Sort'
            },
            {
                'id': 'coding-mcq-4',
                'question': 'What is the purpose of the virtual keyword in C++?',
                'options': ['Memory optimization', 'Type checking', 'Dynamic dispatch', 'Static binding'],
                'correctAnswer': 'Dynamic dispatch'
            },
            {
                'id': 'coding-mcq-5',
                'question': 'Which HTTP method is idempotent?',
                'options': ['POST', 'PUT', 'PATCH', 'DELETE'],
                'correctAnswer': 'PUT'
            },
            {
                'id': 'coding-mcq-6',
                'question': 'What is the main advantage of using promises over callbacks?',
                'options': ['Speed', 'Chain handling', 'Memory usage', 'Syntax'],
                'correctAnswer': 'Chain handling'
            }
        ],
        'descriptive': [
            {
                'id': 'coding-desc-1',
                'question': 'Explain the concept of dependency injection and its benefits in software development.',
                'sampleAnswer': 'Dependency injection is a design pattern where objects receive their dependencies instead of creating them. Benefits include: improved testability through easy mocking of dependencies, better code reusability, reduced coupling between components, and easier maintenance. It follows the Inversion of Control principle and helps achieve SOLID principles, particularly Dependency Inversion.'
            },
            {
                'id': 'coding-desc-2',
                'question': 'Describe the differences between REST and GraphQL APIs, including their pros and cons.',
                'sampleAnswer': 'REST APIs use standard HTTP methods and endpoints for different resources, while GraphQL provides a single endpoint where clients can specify exactly what data they need. REST excels in caching and is widely adopted, but can lead to over-fetching. GraphQL offers precise data fetching and reduces network requests, but adds complexity and can be challenging to cache effectively.'
            }
        ],
        'domainSpecific': {
            'question': 'Implement a function to find the longest palindromic substring in a given string. Optimize for both time and space complexity.',
            'description': 'Input: String of length 1 to 1000\nOutput: Longest palindromic substring\nExample: \'babad\' → \'bab\' or \'aba\'\nConstraints: O(n²) time complexity or better',
            'type': 'code',
            'maxScore': 20
        }
    },
    'marketing': {
        'mcqs': [
            {
                'id': 'marketing-mcq-0',
                'question': 'Which metric best measures customer acquisition cost?',
                'options': ['Total Marketing Cost / New Customers', 'Revenue / Marketing Cost', 'Profit / New Customers', 'Marketing Cost / Revenue'],
                'correctAnswer': 'Total Marketing Cost / New Customers'
            },
            {
                'id': 'marketing-mcq-1',
                'question': 'What is the primary purpose of A/B testing in marketing?',
                'options': ['Cost reduction', 'Performance comparison', 'Brand awareness', 'Customer service'],
                'correctAnswer': 'Performance comparison'
            },
            {
                'id': 'marketing-mcq-2',
                'question': 'Which social media platform typically has the highest B2B engagement?',
                'options': ['Instagram', 'LinkedIn', 'Twitter', 'Facebook'],
                'correctAnswer': 'LinkedIn'
            },
            {
                'id': 'marketing-mcq-3',
                'question': 'What is the recommended length for an email subject line?',
                'options': ['10-20 characters', '20-30 characters', '40-50 characters', '60-70 characters'],
                'correctAnswer': '40-50 characters'
            },
            {
                'id': 'marketing-mcq-4',
                'question': 'Which marketing model describes the customer journey?',
                'options': ['4Ps', 'AIDA', 'SWOT', 'BCG Matrix'],
                'correctAnswer': 'AIDA'
            },
            {
                'id': 'marketing-mcq-5',
                'question': 'What is the primary goal of content marketing?',
                'options': ['Direct sales', 'Brand awareness', 'Value creation', 'Competition analysis'],
                'correctAnswer': 'Value creation'
            },
            {
                'id': 'marketing-mcq-6',
                'question': 'Which SEO element has the most impact on search rankings?',
                'options': ['Meta descriptions', 'Quality content', 'Keywords density', 'Image alt text'],
                'correctAnswer': 'Quality content'
            }
        ],
        'descriptive': [
            {
                'id': 'marketing-desc-1',
                'question': 'Develop a comprehensive social media strategy for a new B2C startup in the fitness industry.',
                'sampleAnswer': 'Start with platform selection (Instagram and TikTok primary, YouTube for long-form) based on target demographic (18-35 years). Focus on high-quality, interactive content like short workout clips, live Q&A sessions, and user challenges. Schedule consistent posts and analyze metrics like engagement rates weekly. Collaborate with micro-influencers and use targeted ads for maximum reach.'
            },
            {
                'id': 'marketing-desc-2',
                'question': 'Explain the role of data analytics in optimizing marketing campaigns.',
                'sampleAnswer': 'Data analytics helps identify patterns in customer behavior, refine target audiences, and measure ROI effectively. Real-time insights from platforms like Google Analytics enable quick adjustments to strategies. By tracking KPIs like CTR and conversion rates, it ensures campaigns are data-driven and resource-efficient.'
            }
        ],
        'domainSpecific': {
            'question': 'Create a 3-minute pitch presentation for launching a new product in the health tech sector. Upload the slides as a PDF.',
            'description': 'Include:\n- Problem statement and solution\n- Target audience\n- Marketing strategy\n- Financial projections',
            'type': 'presentation_url',
            'maxScore': 20
        }
    }
}


# Constants for scoring
MCQ_POINTS = 1  # Points per MCQ
DESCRIPTIVE_POINTS = 10  # Points per descriptive question
DOMAIN_SPECIFIC_POINTS = 20  # Points for domain-specific task
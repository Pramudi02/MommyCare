import React, { useState } from 'react';
import { FiSearch, FiPlus, FiX, FiEdit } from 'react-icons/fi';
import './Education.css';

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyArticles, setShowMyArticles] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'First Trimester Essentials: What to Expect',
      category: 'pregnancy',
      author: 'Midwife Sarah',
      date: '2024-02-18',
      readTime: '6 min',
      summary:
        'Symptoms, nutrition tips, and when to call your provider during the first 12 weeks.',
      content: `The first trimester of pregnancy is a time of incredible change and growth. During these initial 12 weeks, your body undergoes remarkable transformations to support the developing baby.

**What to Expect:**
- Morning sickness (which can occur at any time of day)
- Fatigue and increased need for rest
- Breast tenderness and changes
- Frequent urination
- Mood swings and emotional changes

**Nutrition Tips:**
- Take prenatal vitamins with folic acid
- Stay hydrated with plenty of water
- Eat small, frequent meals to manage nausea
- Include protein-rich foods in your diet
- Avoid raw fish, unpasteurized dairy, and excessive caffeine

**When to Call Your Provider:**
- Severe nausea and vomiting
- Heavy bleeding or cramping
- High fever
- Severe abdominal pain
- Dizziness or fainting

Remember, every pregnancy is unique, and what's normal for one person may not be for another. Always trust your instincts and reach out to your healthcare provider if something doesn't feel right.`,
      tags: ['pregnancy', 'trimester', 'nutrition'],
      isMyArticle: false
    },
    {
      id: 2,
      title: 'Postpartum Healing: A Practical 6-Week Guide',
      category: 'postpartum',
      author: 'Midwife Emma',
      date: '2024-02-10',
      readTime: '8 min',
      summary:
        'Realistic recovery milestones, perineal care, mental health, and safe activity resumption.',
      content: `The postpartum period, often called the "fourth trimester," is a crucial time for healing and adjustment. This comprehensive guide covers the first 6 weeks after delivery.

**Week 1-2: Immediate Recovery**
- Rest as much as possible when baby sleeps
- Use ice packs and sitz baths for perineal care
- Take prescribed pain medications as needed
- Begin gentle pelvic floor exercises
- Monitor for signs of infection

**Week 3-4: Gradual Activity**
- Start short walks around your home
- Continue pelvic floor exercises
- Begin light stretching
- Monitor bleeding and healing
- Establish breastfeeding routine

**Week 5-6: Building Strength**
- Gradually increase walking distance
- Begin gentle core exercises
- Consider postpartum yoga
- Continue monitoring healing
- Plan return to regular activities

**Mental Health Support:**
- Accept help from family and friends
- Join postpartum support groups
- Watch for signs of postpartum depression
- Practice self-care when possible
- Communicate openly with your partner

**When to Seek Medical Attention:**
- Heavy bleeding or large clots
- Fever above 100.4°F
- Severe pain not relieved by medication
- Signs of infection
- Thoughts of harming yourself or baby

Remember, healing takes time and every woman's recovery is different. Be patient with yourself and celebrate small milestones.`,
      tags: ['postpartum', 'recovery', 'healing'],
      isMyArticle: false
    },
    {
      id: 3,
      title: 'Newborn Basics: Feeding, Sleep, and Soothing',
      category: 'baby-care',
      author: 'Dr. Lee',
      date: '2024-02-08',
      readTime: '7 min',
      summary:
        'Foundational tips for feeding schedules, safe sleep, colic, and when to seek help.',
      content: `Caring for a newborn can feel overwhelming, but understanding the basics can help you feel more confident. This guide covers the essential aspects of newborn care.

**Feeding Your Newborn:**
- Newborns typically feed 8-12 times per day
- Watch for hunger cues: rooting, sucking on hands, crying
- Ensure proper latch for breastfeeding
- Burp baby after each feeding
- Track wet and dirty diapers

**Safe Sleep Guidelines:**
- Always place baby on their back to sleep
- Use a firm, flat sleep surface
- Keep soft objects and loose bedding out of crib
- Share room but not bed for first 6 months
- Avoid overheating

**Soothing Techniques:**
- Swaddling (until baby shows signs of rolling)
- Gentle rocking or swaying
- White noise or shushing sounds
- Pacifier use
- Skin-to-skin contact

**Understanding Colic:**
- Crying for 3+ hours per day, 3+ days per week
- Usually peaks around 6 weeks
- Try different soothing techniques
- Consider dietary changes if breastfeeding
- Seek support from healthcare provider

**When to Call the Doctor:**
- Fever in babies under 3 months
- Decreased feeding or wet diapers
- Unusual crying or behavior
- Breathing difficulties
- Jaundice that doesn't improve

**Self-Care for Parents:**
- Accept help from others
- Sleep when baby sleeps
- Eat nutritious meals
- Stay hydrated
- Take breaks when possible

Remember, you're doing a great job! Trust your instincts and don't hesitate to reach out for help when needed.`,
      tags: ['newborn', 'sleep', 'feeding'],
      isMyArticle: false
    },
    {
      id: 4,
      title: 'Gestational Diabetes: Diet Ideas that Work',
      category: 'nutrition',
      author: 'Dietitian May',
      date: '2024-01-31',
      readTime: '5 min',
      summary:
        'Meal planning, grocery lists, and simple swaps to keep sugars steady during pregnancy.',
      content: `Gestational diabetes affects many pregnant women and requires careful attention to diet and lifestyle. With the right approach, you can manage your blood sugar effectively while ensuring your baby gets proper nutrition.

**Understanding Gestational Diabetes:**
- Develops during pregnancy due to hormonal changes
- Usually resolves after delivery
- Requires monitoring blood sugar levels
- Managed through diet, exercise, and sometimes medication

**Key Dietary Principles:**
- Eat regular meals and snacks
- Include protein with every meal
- Choose complex carbohydrates
- Limit simple sugars
- Monitor portion sizes

**Meal Planning Tips:**
- Plan meals ahead of time
- Include a variety of foods
- Balance carbohydrates with protein
- Eat at regular intervals
- Keep healthy snacks available

**Recommended Foods:**
- Lean proteins: chicken, fish, eggs, legumes
- Complex carbohydrates: whole grains, vegetables
- Healthy fats: nuts, avocado, olive oil
- Low-glycemic fruits: berries, apples, pears
- Non-starchy vegetables: leafy greens, broccoli, cauliflower

**Foods to Limit:**
- Refined carbohydrates
- Sugary beverages
- Processed foods
- Large portions of high-carb foods
- Fruit juices

**Sample Meal Plan:**
**Breakfast:** Greek yogurt with berries and nuts
**Snack:** Apple with peanut butter
**Lunch:** Grilled chicken salad with mixed greens
**Snack:** Carrot sticks with hummus
**Dinner:** Salmon with quinoa and roasted vegetables

**Monitoring and Testing:**
- Check blood sugar as recommended
- Keep a food diary
- Note how foods affect your levels
- Work closely with your healthcare team
- Attend all prenatal appointments

**Exercise Recommendations:**
- 30 minutes of moderate activity most days
- Walking is excellent for blood sugar control
- Prenatal yoga or swimming
- Always consult your doctor before starting

Remember, gestational diabetes is manageable with the right approach. Focus on nourishing both yourself and your baby while keeping your blood sugar stable.`,
      tags: ['nutrition', 'diabetes', 'pregnancy'],
      isMyArticle: false
    },
    {
      id: 5,
      title: 'Breastfeeding Tips for New Mothers',
      category: 'baby-care',
      author: 'You',
      date: '2024-03-15',
      readTime: '4 min',
      summary: 'Essential tips and techniques for successful breastfeeding from a midwife\'s perspective.',
      content: `As a midwife, I've helped countless mothers establish successful breastfeeding relationships with their babies. Here are the most important tips I share with new mothers.

**Getting Started:**
- Begin breastfeeding within the first hour after birth
- Practice skin-to-skin contact
- Learn proper latch technique
- Be patient with yourself and your baby
- Seek help early if needed

**Proper Latch Technique:**
- Position baby's nose to your nipple
- Wait for baby to open mouth wide
- Bring baby to breast, not breast to baby
- Ensure baby takes both nipple and areola
- Listen for swallowing sounds

**Common Challenges and Solutions:**
- **Sore nipples:** Check latch, use lanolin cream
- **Engorgement:** Frequent feeding, warm compresses
- **Low supply:** Increase feeding frequency, stay hydrated
- **Oversupply:** Block feeding technique
- **Mastitis:** Rest, frequent feeding, antibiotics if needed

**Nutrition for Breastfeeding Mothers:**
- Eat an extra 300-500 calories per day
- Stay well hydrated
- Include protein-rich foods
- Take prenatal vitamins
- Limit caffeine and alcohol

**When to Seek Help:**
- Persistent pain during feeding
- Baby not gaining weight
- Signs of dehydration in baby
- Fever or flu-like symptoms
- Concerns about milk supply

Remember, breastfeeding is a learned skill for both mother and baby. Don't hesitate to reach out for support from lactation consultants, midwives, or breastfeeding support groups.`,
      tags: ['breastfeeding', 'newborn', 'tips'],
      isMyArticle: true
    }
  ]);

  const [composer, setComposer] = useState({ 
    title: '', 
    category: 'pregnancy', 
    summary: '',
    content: ''
  });

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'pregnancy', name: 'Pregnancy' },
    { id: 'postpartum', name: 'Postpartum' },
    { id: 'baby-care', name: 'Baby Care' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'mental-health', name: 'Mental Health' },
  ];

  const filtered = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesMyArticles = !showMyArticles || a.isMyArticle;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch && matchesMyArticles;
  });

  const addArticle = () => {
    if (!composer.title.trim() || !composer.summary.trim() || !composer.content.trim()) return;
    const newArticle = {
      id: Date.now(),
      title: composer.title.trim(),
      category: composer.category,
      author: 'You',
      date: new Date().toISOString().slice(0, 10),
      readTime: '~5 min',
      summary: composer.summary.trim(),
      content: composer.content.trim(),
      tags: [],
      isMyArticle: true
    };
    setArticles([newArticle, ...articles]);
    setComposer({ title: '', category: 'pregnancy', summary: '', content: '' });
  };

  const openArticleModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="education-page">
      <div className="education-header">
        <div className="education-header-icon">
          <FiEdit className="w-6 h-6" />
        </div>
        <div className="education-title">
          <h1>Articles</h1>
          <p>Write and explore practical articles, advice, and insights for health, pregnancy, and child care</p>
        </div>
        <button className="add-resource-btn" onClick={addArticle}>
          <FiPlus />
          Publish Article
        </button>
      </div>

      {/* Article Composer */}
      <div className="resource-card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Write a New Article</h3>
        <div className="resource-meta" style={{ marginBottom: 10 }}>
          <div className="meta-item">
            <span className="meta-label">Title</span>
            <input
              className="form-input"
              type="text"
              placeholder="Enter article title..."
              value={composer.title}
              onChange={(e) => setComposer({ ...composer, title: e.target.value })}
            />
          </div>
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <select
              className="form-select"
              value={composer.category}
              onChange={(e) => setComposer({ ...composer, category: e.target.value })}
            >
              {categories
                .filter((c) => c.id !== 'all')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="meta-item" style={{ marginBottom: 10 }}>
          <span className="meta-label">Summary</span>
          <textarea
            className="form-input"
            rows="2"
            placeholder="Brief summary of your article..."
            value={composer.summary}
            onChange={(e) => setComposer({ ...composer, summary: e.target.value })}
          />
        </div>
        <div className="meta-item" style={{ marginBottom: 10 }}>
          <span className="meta-label">Full Article Content</span>
          <textarea
            className="form-input"
            rows="6"
            placeholder="Write your full article content here..."
            value={composer.content}
            onChange={(e) => setComposer({ ...composer, content: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button className="action-btn primary" onClick={addArticle}>
            Publish Article
          </button>
        </div>
      </div>

      <div className="education-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon"><FiSearch /></span>
        </div>

        <div className="filter-controls">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
          
          <button
            className={`filter-btn ${showMyArticles ? 'active' : ''}`}
            onClick={() => setShowMyArticles(!showMyArticles)}
          >
            {showMyArticles ? 'Show All Articles' : 'Show My Articles Only'}
          </button>
        </div>
      </div>

      <div className="education-content">
        <div className="resources-grid">
          {filtered.map((a) => (
            <div key={a.id} className="resource-card">
              <div className="resource-header">
                <div className="resource-type">{a.readTime}</div>
                {a.isMyArticle && <div className="my-article-badge">My Article</div>}
              </div>

              <div className="resource-content">
                <h3 className="resource-title">{a.title}</h3>
                <p className="resource-description">{a.summary}</p>

                <div className="resource-meta">
                  <div className="meta-item">
                    <span className="meta-label">Written by:</span>
                    <span className="meta-value">{a.author}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{categories.find((c) => c.id === a.category)?.name || 'General'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Date:</span>
                    <span className="meta-value">{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="resource-tags">
                  {(a.tags || []).map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="resource-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => openArticleModal(a)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="no-resources">
            <div className="no-resources-icon">📝</div>
            <h3>No articles found</h3>
            <p>Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {isModalOpen && selectedArticle && (
        <div className="modal-overlay" onClick={closeArticleModal}>
          <div className="article-modal" onClick={(e) => e.stopPropagation()}>
            <div className="article-modal-header">
              <h2>{selectedArticle.title}</h2>
              <button className="modal-close-btn" onClick={closeArticleModal}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="article-modal-meta">
              <div className="meta-item">
                <span className="meta-label">Written by:</span>
                <span className="meta-value">{selectedArticle.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{categories.find((c) => c.id === selectedArticle.category)?.name || 'General'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <span className="meta-value">{new Date(selectedArticle.date).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Read time:</span>
                <span className="meta-value">{selectedArticle.readTime}</span>
              </div>
            </div>

            <div className="article-modal-content">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="article-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="article-modal-footer">
              <div className="article-tags">
                {(selectedArticle.tags || []).map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;

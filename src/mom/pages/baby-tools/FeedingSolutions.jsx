import React, { useState } from 'react';
import { Baby, TrendingUp } from 'lucide-react';
import './FeedingSolutions.css';

const feedingProblems = [
  {
    emoji: '😫',
    title: 'Breastfeeding Difficulties',
    description: 'Baby having trouble latching or feeding properly',
    solutions: [
      'Ensure proper latch - baby\'s mouth should cover areola',
      'Try different positions: cradle, cross-cradle, football hold',
      'Check for tongue-tie or lip-tie issues',
      'Make sure baby is calm and alert during feeding',
      'Consult a lactation consultant for personalized help',
      'Practice skin-to-skin contact to encourage feeding',
    ],
    expanded: true,
  },
  {
    emoji: '🍼',
    title: 'Bottle Refusal',
    description: 'Baby refusing to take bottle or formula',
    solutions: null,
    expanded: false,
  },
  {
    emoji: '😴',
    title: 'Sleepy Feeder',
    description: 'Baby falls asleep during feeding sessions',
    solutions: [
      'Gently tickle baby\'s feet or cheek to wake them',
      'Change diaper mid-feeding to rouse baby',
      'Strip baby down to diaper for skin-to-skin contact',
      'Use a cool, damp cloth on baby\'s forehead',
      'Try feeding in a brighter, more stimulating environment',
      'Burp baby frequently to keep them active',
    ],
    expanded: true,
  },
  {
    emoji: '🤮',
    title: 'Frequent Spitting Up',
    description: 'Baby spits up frequently after feeding',
    solutions: null,
    expanded: false,
  },
  {
    emoji: '😣',
    title: 'Colic & Gas',
    description: 'Baby experiencing excessive crying and gas pain',
    solutions: null,
    expanded: false,
  },
  {
    emoji: '🥄',
    title: 'Solid Food Refusal',
    description: 'Baby refusing to eat solid foods or new textures',
    solutions: null,
    expanded: false,
  },
];

const mealPlans = [
  {
    age: '0-6 months',
    emoji: '👶',
    title: 'Newborn Feeding',
    description: 'Exclusive breastfeeding or formula feeding schedule',
    details: null,
    expanded: false,
  },
  {
    age: '6-8 months',
    emoji: '🥄',
    title: 'First Foods',
    description: 'Introduction to solid foods and purees',
    details: (
      <>
        <h4>Daily Feeding Schedule:</h4>
        <div className="meal-sample">
          <h5>🌅 Morning (6-7 AM)</h5>
          <p>Breast milk or formula feeding</p>
        </div>
        <div className="meal-sample">
          <h5>🍌 Breakfast (8-9 AM)</h5>
          <p>Single-grain cereal mixed with breast milk/formula</p>
          <p>Pureed banana or avocado (2-3 tablespoons)</p>
        </div>
        <div className="meal-sample">
          <h5>🥕 Lunch (12-1 PM)</h5>
          <p>Pureed sweet potato or carrot (2-3 tablespoons)</p>
          <p>Breast milk or formula feeding</p>
        </div>
        <div className="meal-sample">
          <h5>🍎 Afternoon Snack (3-4 PM)</h5>
          <p>Pureed apple or pear (1-2 tablespoons)</p>
        </div>
        <div className="meal-sample">
          <h5>🌙 Evening</h5>
          <p>Breast milk or formula feeding before bed</p>
        </div>
      </>
    ),
    expanded: true,
  },
  {
    age: '8-10 months',
    emoji: '🍎',
    title: 'Expanding Textures',
    description: 'Introducing finger foods and varied textures',
    details: null,
    expanded: false,
  },
  {
    age: '10-12 months',
    emoji: '🍽️',
    title: 'Independent Eating',
    description: 'Encouraging self-feeding and family foods',
    details: (
      <>
        <h4>Daily Meal Plan:</h4>
        <div className="meal-sample">
          <h5>🥞 Breakfast</h5>
          <p>Scrambled eggs with toast fingers</p>
          <p>Diced soft fruits (banana, berries)</p>
          <p>Breast milk or formula</p>
        </div>
        <div className="meal-sample">
          <h5>🥪 Lunch</h5>
          <p>Soft cooked pasta with mild sauce</p>
          <p>Steamed vegetables (broccoli, carrots)</p>
          <p>Shredded cheese or soft meat</p>
        </div>
        <div className="meal-sample">
          <h5>🍌 Snacks</h5>
          <p>Soft fruit pieces, crackers, or yogurt</p>
        </div>
        <div className="meal-sample">
          <h5>🍗 Dinner</h5>
          <p>Soft chicken pieces or fish</p>
          <p>Mashed potatoes or rice</p>
          <p>Cooked vegetables</p>
        </div>
      </>
    ),
    expanded: true,
  },
  {
    age: '12+ months',
    emoji: '🍝',
    title: 'Toddler Meals',
    description: 'Transitioning to family meals and varied nutrition',
    details: null,
    expanded: false,
  },
  {
    age: 'All Ages',
    emoji: '🥗',
    title: 'Healthy Snacks',
    description: 'Age-appropriate healthy snack ideas',
    details: null,
    expanded: false,
  },
];

function FeedingSolutions() {
  const [activeTab, setActiveTab] = useState('problems');
  const [problemCards, setProblemCards] = useState(
    feedingProblems.map(card => card.expanded)
  );
  const [mealCards, setMealCards] = useState(
    mealPlans.map(card => card.expanded)
  );

  const toggleProblemCard = idx => {
    setProblemCards(cards =>
      cards.map((open, i) => (i === idx ? !open : open))
    );
  };
  const toggleMealCard = idx => {
    setMealCards(cards =>
      cards.map((open, i) => (i === idx ? !open : open))
    );
  };

  return (
    <div className="container">
      <div className="header header-line">
        <h1>
          <Baby className="header-icon" />
          Baby Feeding Solutions & Meal Plans
        </h1>
        <p>Expert guidance for your baby's feeding journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="glass-tab-navigation">
        <button
          onClick={() => setActiveTab('problems')}
          className={`tab-button ${activeTab === 'problems' ? 'active' : ''}`}
        >
          Baby Feeding Problems
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`tab-button ${activeTab === 'meals' ? 'active' : ''}`}
        >
          Baby Meal Plans by Age
        </button>
      </div>

      {/* Baby Feeding Problems Tab */}
      {activeTab === 'problems' && (
        <div className="section feeding-problems">
          <h2 className="section-title">🍼 Baby Feeding Problems</h2>
          <div className="cards-grid">
            {feedingProblems.map((card, idx) => (
              <div
                className={`card${problemCards[idx] ? ' expanded' : ''}`}
                key={card.title}
                onClick={() => toggleProblemCard(idx)}
              >
                <div className="card-header">
                  <div className="card-emoji">{card.emoji}</div>
                  <div className="card-title">{card.title}</div>
                  <div className="expand-icon">▼</div>
                </div>
                <div className="card-description">{card.description}</div>
                <div className={`dropdown-content${problemCards[idx] ? ' open' : ''}`}>
                  {card.solutions && (
                    <>
                      <h4>Solutions & Tips:</h4>
                      <ul>
                        {card.solutions.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Baby Meal Plans Tab */}
      {activeTab === 'meals' && (
        <div className="section meal-plans">
          <h2 className="section-title">🍽️ Baby Meal Plans by Age</h2>
          <div className="cards-grid">
            {mealPlans.map((card, idx) => (
              <div
                className={`card${mealCards[idx] ? ' expanded' : ''}`}
                key={card.title}
                onClick={() => toggleMealCard(idx)}
              >
                <div className="card-header">
                  <div className="card-emoji">{card.emoji}</div>
                  <div className="card-title">{card.title}</div>
                  <div className="expand-icon">▼</div>
                </div>
                <div className="card-description">{card.description}</div>
                <div className={`dropdown-content${mealCards[idx] ? ' open' : ''}`}>
                  {card.details && card.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedingSolutions; 
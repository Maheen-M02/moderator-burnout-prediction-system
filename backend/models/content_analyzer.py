import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import warnings
warnings.filterwarnings('ignore')

class ContentModerator:
    def __init__(self):
        # Toxic keywords database
        self.toxic_keywords = [
            'hate', 'kill', 'stupid', 'idiot', 'dumb', 'loser', 'trash', 
            'garbage', 'worthless', 'pathetic', 'disgusting', 'awful',
            'terrible', 'horrible', 'worst', 'suck', 'crap', 'damn'
        ]
        
        self.offensive_patterns = [
            r'\b(f+u+c+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+)\b',
            r'\b(d+a+m+n+|h+e+l+l+|c+r+a+p+)\b',
            r'[!@#$%^&*]{3,}',  # Excessive special characters
        ]
        
        self.positive_keywords = [
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
            'love', 'like', 'appreciate', 'thank', 'helpful', 'nice', 'kind',
            'awesome', 'brilliant', 'perfect', 'beautiful'
        ]
        
        # Initialize simple sentiment classifier
        self.vectorizer = TfidfVectorizer(max_features=100)
        self._train_simple_model()
    
    def _train_simple_model(self):
        """Train a simple sentiment model with sample data"""
        # Sample training data
        training_texts = [
            "I love this product, it's amazing!",
            "This is great, thank you so much!",
            "Excellent work, very helpful",
            "This is terrible, I hate it",
            "Worst experience ever, complete garbage",
            "This sucks, total waste of time",
            "Pretty good, works well",
            "Not bad, could be better",
            "Awful service, very disappointed"
        ]
        training_labels = [1, 1, 1, 0, 0, 0, 1, 1, 0]  # 1=positive, 0=negative
        
        X = self.vectorizer.fit_transform(training_texts)
        self.sentiment_model = MultinomialNB()
        self.sentiment_model.fit(X, training_labels)
    
    def analyze_content(self, text):
        """Comprehensive content analysis"""
        if not text or not text.strip():
            return {
                "error": "Empty text provided",
                "should_moderate": False
            }
        
        text_lower = text.lower()
        
        # Toxicity detection
        toxicity_score, toxic_words = self._detect_toxicity(text_lower)
        
        # Offensive language detection
        offensive_score, offensive_matches = self._detect_offensive(text_lower)
        
        # Sentiment analysis
        sentiment_score, sentiment_label = self._analyze_sentiment(text)
        
        # Spam detection
        spam_score, spam_indicators = self._detect_spam(text)
        
        # Calculate overall risk score (adjusted weights for more sensitivity)
        risk_score = float(
            toxicity_score * 0.40 +  # Increased from 0.35
            offensive_score * 0.35 +  # Increased from 0.30
            (1 - sentiment_score) * 0.15 +  # Decreased from 0.20
            spam_score * 0.10  # Decreased from 0.15
        )
        
        # Determine moderation action
        should_moderate = bool(risk_score > 0.3)  # Lowered from 0.5
        action = self._determine_action(risk_score)
        
        # Generate explanation
        explanation = self._generate_explanation(
            toxicity_score, offensive_score, sentiment_score, spam_score
        )
        
        return {
            "text": text,
            "risk_score": round(risk_score, 3),
            "should_moderate": should_moderate,
            "action": action,
            "metrics": {
                "toxicity": {
                    "score": round(toxicity_score, 3),
                    "level": self._get_level(toxicity_score),
                    "detected_words": toxic_words
                },
                "offensive_language": {
                    "score": round(offensive_score, 3),
                    "level": self._get_level(offensive_score),
                    "matches": offensive_matches
                },
                "sentiment": {
                    "score": round(sentiment_score, 3),
                    "label": sentiment_label,
                    "polarity": "positive" if sentiment_score > 0.5 else "negative"
                },
                "spam": {
                    "score": round(spam_score, 3),
                    "level": self._get_level(spam_score),
                    "indicators": spam_indicators
                }
            },
            "explanation": explanation,
            "recommendations": self._get_recommendations(risk_score, action)
        }
    
    def _detect_toxicity(self, text):
        """Detect toxic content"""
        toxic_found = []
        score = 0.0
        
        for keyword in self.toxic_keywords:
            if keyword in text:
                toxic_found.append(keyword)
                score += 0.25  # Increased from 0.15
        
        # Check for ALL CAPS (aggressive tone)
        if text.isupper() and len(text) > 10:
            score += 0.3  # Increased from 0.2
            toxic_found.append("AGGRESSIVE_CAPS")
        
        # Check for excessive punctuation
        if text.count('!') > 2 or text.count('?') > 2:
            score += 0.2  # Increased from 0.1
        
        return float(min(score, 1.0)), toxic_found
    
    def _detect_offensive(self, text):
        """Detect offensive language patterns"""
        matches = []
        score = 0.0
        
        for pattern in self.offensive_patterns:
            found = re.findall(pattern, text, re.IGNORECASE)
            if found:
                matches.extend(found)
                score += 0.4  # Increased from 0.3
        
        # Check for masked profanity (f**k, sh*t, etc.)
        masked_pattern = r'\b\w*[\*@#$%]\w*\b'
        masked = re.findall(masked_pattern, text)
        if masked:
            matches.extend(masked)
            score += 0.3  # Increased from 0.2
        
        return float(min(score, 1.0)), matches
    
    def _analyze_sentiment(self, text):
        """Analyze sentiment using trained model"""
        try:
            # Use trained model
            X = self.vectorizer.transform([text])
            prediction = self.sentiment_model.predict(X)[0]
            proba = self.sentiment_model.predict_proba(X)[0]
            
            sentiment_score = float(proba[1])  # Probability of positive class
            sentiment_label = "Positive" if int(prediction) == 1 else "Negative"
            
        except:
            # Fallback to keyword-based sentiment
            positive_count = sum(1 for word in self.positive_keywords if word in text.lower())
            negative_count = sum(1 for word in self.toxic_keywords if word in text.lower())
            
            total = positive_count + negative_count
            if total == 0:
                sentiment_score = 0.5
                sentiment_label = "Neutral"
            else:
                sentiment_score = float(positive_count / total)
                sentiment_label = "Positive" if sentiment_score > 0.5 else "Negative"
        
        return sentiment_score, sentiment_label
    
    def _detect_spam(self, text):
        """Detect spam indicators"""
        indicators = []
        score = 0.0
        
        # Excessive links
        link_count = len(re.findall(r'http[s]?://|www\.', text))
        if link_count > 2:
            indicators.append(f"{link_count} links detected")
            score += 0.3
        
        # Excessive repetition
        words = text.split()
        if len(words) > 0:
            unique_ratio = len(set(words)) / len(words)
            if unique_ratio < 0.5:
                indicators.append("Repetitive content")
                score += 0.2
        
        # Excessive emojis/special chars
        special_count = len(re.findall(r'[^\w\s]', text))
        if special_count > len(text) * 0.3:
            indicators.append("Excessive special characters")
            score += 0.2
        
        # All caps
        if text.isupper() and len(text) > 20:
            indicators.append("ALL CAPS")
            score += 0.15
        
        return float(min(score, 1.0)), indicators
    
    def _get_level(self, score):
        """Convert score to level"""
        if score < 0.3:
            return "Low"
        elif score < 0.6:
            return "Medium"
        else:
            return "High"
    
    def _determine_action(self, risk_score):
        """Determine moderation action"""
        if risk_score >= 0.6:
            return "Block"
        elif risk_score >= 0.4:
            return "Review"
        elif risk_score >= 0.25:
            return "Flag"
        else:
            return "Approve"
    
    def _generate_explanation(self, toxicity, offensive, sentiment, spam):
        """Generate human-readable explanation"""
        explanations = []
        
        if toxicity > 0.3:  # Lowered from 0.5
            explanations.append("Toxicity detected in content")
        if offensive > 0.3:  # Lowered from 0.5
            explanations.append("Offensive language found")
        if sentiment < 0.4:  # Raised from 0.3
            explanations.append("Negative sentiment detected")
        if spam > 0.3:  # Lowered from 0.5
            explanations.append("Spam indicators present")
        
        if not explanations:
            if sentiment > 0.7:
                return "Content appears positive and safe"
            else:
                return "Content appears acceptable with minor concerns"
        
        return ". ".join(explanations)
    
    def _get_recommendations(self, risk_score, action):
        """Get moderation recommendations"""
        recommendations = []
        
        if action == "Block":
            recommendations.append("Immediately block this content from being published")
            recommendations.append("Notify user about community guidelines violation")
            recommendations.append("Consider temporary account restriction")
        elif action == "Review":
            recommendations.append("Queue for manual review by moderator")
            recommendations.append("Temporarily hide content until reviewed")
            recommendations.append("Send warning to user")
        elif action == "Flag":
            recommendations.append("Flag for monitoring")
            recommendations.append("Allow publication but track user behavior")
            recommendations.append("Consider automated response suggesting tone adjustment")
        else:
            recommendations.append("Approve content for publication")
            recommendations.append("No action required")
        
        return recommendations
    
    def batch_analyze(self, texts):
        """Analyze multiple texts"""
        results = []
        for text in texts:
            results.append(self.analyze_content(text))
        
        # Calculate statistics
        total = len(results)
        blocked = sum(1 for r in results if r['action'] == 'Block')
        flagged = sum(1 for r in results if r['action'] in ['Flag', 'Review'])
        
        return {
            "results": results,
            "statistics": {
                "total": total,
                "blocked": blocked,
                "flagged": flagged,
                "approved": total - blocked - flagged,
                "block_rate": round(blocked / total * 100, 1) if total > 0 else 0
            }
        }

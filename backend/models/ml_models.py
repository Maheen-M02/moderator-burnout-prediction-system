import pandas as pd
import numpy as np
from sklearn.naive_bayes import GaussianNB
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
import warnings
warnings.filterwarnings('ignore')

class ModeratorAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        
    def analyze(self, df):
        """Main analysis pipeline"""
        # Feature engineering
        df = self._engineer_features(df)
        
        # Run ML models
        predictions = self._run_ml_models(df)
        
        # Generate insights
        insights = self._generate_insights(df, predictions)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(df, predictions)
        
        # Prepare chart data
        charts = self._prepare_charts(df)
        
        # Calculate KPIs
        kpis = self._calculate_kpis(df, predictions)
        
        return {
            "predictions": predictions,
            "insights": insights,
            "recommendations": recommendations,
            "charts": charts,
            "kpis": kpis
        }
    
    def _engineer_features(self, df):
        """Create derived features"""
        df = df.copy()
        
        # Workload score
        df['workload_score'] = (
            df['posts_moderated'] * 0.4 + 
            df['toxic_posts'] * 0.6
        ) / df['activity_hours']
        
        # Toxicity ratio
        df['toxicity_ratio'] = df['toxic_posts'] / (df['posts_moderated'] + 1)
        
        # Burnout indicator (synthetic target)
        df['burnout_risk'] = (
            (df['toxicity_ratio'] > 0.15).astype(int) +
            (df['sentiment_score'] < 0.5).astype(int) +
            (df['workload_score'] > df['workload_score'].quantile(0.75)).astype(int)
        )
        df['burnout_label'] = df['burnout_risk'].apply(
            lambda x: 'High' if x >= 2 else ('Medium' if x == 1 else 'Low')
        )
        
        # Activity trend (synthetic time series)
        df['time_period'] = range(len(df))
        
        return df
    
    def _run_ml_models(self, df):
        """Execute ML models"""
        results = {}
        
        # Prepare features
        feature_cols = ['posts_moderated', 'toxic_posts', 'sentiment_score', 
                       'activity_hours', 'response_time', 'workload_score', 'toxicity_ratio']
        X = df[feature_cols].fillna(0)
        
        # Naive Bayes for sentiment classification
        sentiment_labels = (df['sentiment_score'] > 0.6).astype(int)
        X_train, X_test, y_train, y_test = train_test_split(X, sentiment_labels, test_size=0.3, random_state=42)
        
        nb_model = GaussianNB()
        nb_model.fit(X_train, y_train)
        nb_pred = nb_model.predict(X_test)
        nb_accuracy = accuracy_score(y_test, nb_pred)
        
        results['naive_bayes'] = {
            'predictions': nb_pred.tolist(),
            'accuracy': float(nb_accuracy)
        }
        
        # K-Means clustering
        X_scaled = self.scaler.fit_transform(X)
        kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(X_scaled)
        
        results['clusters'] = clusters.tolist()
        results['cluster_centers'] = kmeans.cluster_centers_.tolist()
        
        # Cluster analysis
        cluster_info = {}
        for i in range(3):
            cluster_data = df[clusters == i]
            cluster_info[str(i)] = {
                'count': int(len(cluster_data)),
                'avg_burnout': float(cluster_data['burnout_risk'].mean()),
                'description': self._describe_cluster(cluster_data)
            }
        results['cluster_info'] = cluster_info
        
        # Decision Tree for burnout prediction
        y_burnout = df['burnout_risk']
        X_train, X_test, y_train, y_test = train_test_split(X, y_burnout, test_size=0.3, random_state=42)
        
        dt_model = DecisionTreeClassifier(max_depth=5, random_state=42)
        dt_model.fit(X_train, y_train)
        dt_pred = dt_model.predict(X_test)
        dt_accuracy = accuracy_score(y_test, dt_pred)
        
        results['decision_tree'] = {
            'predictions': dt_pred.tolist(),
            'accuracy': float(dt_accuracy),
            'feature_importance': dict(zip(feature_cols, dt_model.feature_importances_.tolist()))
        }
        
        # Linear Regression for workload vs burnout
        X_workload = df[['workload_score']].fillna(0)
        y_burnout_numeric = df['burnout_risk']
        
        lr_model = LinearRegression()
        lr_model.fit(X_workload, y_burnout_numeric)
        lr_pred = lr_model.predict(X_workload)
        lr_r2 = r2_score(y_burnout_numeric, lr_pred)
        
        results['linear_regression'] = {
            'predictions': lr_pred.tolist(),
            'r2_score': float(lr_r2),
            'coefficient': float(lr_model.coef_[0]),
            'intercept': float(lr_model.intercept_)
        }
        
        # Model metrics summary
        results['model_metrics'] = {
            'naive_bayes': {'accuracy': nb_accuracy},
            'decision_tree': {'accuracy': dt_accuracy},
            'linear_regression': {'r2_score': lr_r2}
        }
        
        return results
    
    def _describe_cluster(self, cluster_data):
        """Generate cluster description"""
        avg_sentiment = cluster_data['sentiment_score'].mean()
        avg_toxicity = cluster_data['toxicity_ratio'].mean()
        
        if avg_sentiment > 0.6 and avg_toxicity < 0.1:
            return "Healthy moderators with positive sentiment"
        elif avg_toxicity > 0.15:
            return "High-stress moderators dealing with toxic content"
        else:
            return "Moderate workload with mixed sentiment"
    
    def _generate_insights(self, df, predictions):
        """Generate actionable insights"""
        insights = []
        
        # Toxicity insight
        avg_toxicity = df['toxicity_ratio'].mean()
        if avg_toxicity > 0.15:
            insights.append({
                'type': 'warning',
                'message': f'High toxicity ratio detected: {avg_toxicity:.1%}. Immediate intervention needed.'
            })
        elif avg_toxicity > 0.10:
            insights.append({
                'type': 'warning',
                'message': f'Moderate toxicity levels: {avg_toxicity:.1%}. Monitor closely.'
            })
        else:
            insights.append({
                'type': 'positive',
                'message': f'Toxicity levels are healthy: {avg_toxicity:.1%}'
            })
        
        # Sentiment insight
        avg_sentiment = df['sentiment_score'].mean()
        if avg_sentiment < 0.5:
            insights.append({
                'type': 'negative',
                'message': f'Low average sentiment ({avg_sentiment:.2f}). Team morale may be declining.'
            })
        else:
            insights.append({
                'type': 'positive',
                'message': f'Positive sentiment maintained ({avg_sentiment:.2f})'
            })
        
        # Activity insight
        activity_trend = df['activity_hours'].tail(5).mean() - df['activity_hours'].head(5).mean()
        if activity_trend < -1:
            insights.append({
                'type': 'negative',
                'message': 'Activity hours decreasing. Possible burnout or disengagement.'
            })
        elif activity_trend > 1:
            insights.append({
                'type': 'warning',
                'message': 'Activity hours increasing significantly. Risk of overwork.'
            })
        
        # Burnout insight
        high_burnout_count = len(df[df['burnout_label'] == 'High'])
        if high_burnout_count > 0:
            insights.append({
                'type': 'warning',
                'message': f'{high_burnout_count} moderators at high burnout risk. Urgent action required.'
            })
        
        return insights
    
    def _generate_recommendations(self, df, predictions):
        """Generate recommendations"""
        recommendations = []
        
        high_burnout = len(df[df['burnout_label'] == 'High'])
        avg_workload = df['workload_score'].mean()
        avg_toxicity = df['toxicity_ratio'].mean()
        
        if high_burnout > 0:
            recommendations.append(
                f"Reduce workload for {high_burnout} high-risk moderators immediately"
            )
        
        if avg_toxicity > 0.12:
            recommendations.append(
                "Implement better content filtering to reduce toxic post exposure"
            )
        
        if avg_workload > df['workload_score'].quantile(0.75):
            recommendations.append(
                "Consider hiring additional moderators to distribute workload"
            )
        
        if df['sentiment_score'].mean() < 0.55:
            recommendations.append(
                "Provide mental health support and counseling services"
            )
        
        recommendations.append(
            "Schedule regular check-ins and wellness assessments"
        )
        
        recommendations.append(
            "Implement rotation system to limit exposure to toxic content"
        )
        
        return recommendations
    
    def _prepare_charts(self, df):
        """Prepare data for charts"""
        charts = {}
        
        # Activity over time
        charts['activity_time'] = [
            {'time': f'T{i}', 'activity': float(val)}
            for i, val in enumerate(df['activity_hours'].values)
        ]
        
        # Sentiment over time
        charts['sentiment_time'] = [
            {'time': f'T{i}', 'sentiment': float(val)}
            for i, val in enumerate(df['sentiment_score'].values)
        ]
        
        # Toxic posts distribution
        charts['toxic_posts'] = [
            {'moderator': row['moderator_id'], 'toxic_count': int(row['toxic_posts'])}
            for _, row in df.head(10).iterrows()
        ]
        
        # Workload vs burnout scatter
        charts['workload_burnout'] = [
            {'workload': float(row['workload_score']), 'burnout': int(row['burnout_risk'])}
            for _, row in df.iterrows()
        ]
        
        # Clusters for scatter plot
        if 'cluster' not in df.columns:
            df['cluster'] = 0
        
        charts['clusters'] = [
            {
                'x': float(row['workload_score']),
                'y': float(row['sentiment_score']),
                'cluster': int(row.get('cluster', 0))
            }
            for _, row in df.iterrows()
        ]
        
        return charts
    
    def _calculate_kpis(self, df, predictions):
        """Calculate KPI metrics"""
        high_risk_count = len(df[df['burnout_label'] == 'High'])
        total_count = len(df)
        
        if high_risk_count / total_count > 0.3:
            risk_level = 'High'
        elif high_risk_count / total_count > 0.1:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
        
        return {
            'burnout_risk': risk_level,
            'avg_sentiment': float(df['sentiment_score'].mean()),
            'toxicity_level': float(df['toxicity_ratio'].mean()),
            'activity_score': float(df['activity_hours'].mean())
        }

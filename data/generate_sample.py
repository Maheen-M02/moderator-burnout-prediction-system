import pandas as pd
import numpy as np

def generate_moderator_data(n_moderators=50):
    """Generate synthetic moderator data"""
    np.random.seed(42)
    
    data = {
        'moderator_id': [f'mod_{str(i).zfill(3)}' for i in range(1, n_moderators + 1)],
        'posts_moderated': np.random.randint(80, 250, n_moderators),
        'toxic_posts': np.random.randint(5, 40, n_moderators),
        'sentiment_score': np.random.uniform(0.3, 0.9, n_moderators).round(2),
        'activity_hours': np.random.uniform(6.0, 12.5, n_moderators).round(1),
        'response_time': np.random.uniform(1.5, 5.0, n_moderators).round(1)
    }
    
    df = pd.DataFrame(data)
    df.to_csv('sample_moderator_data.csv', index=False)
    print(f"Generated {n_moderators} moderator records")
    print(df.head())

if __name__ == "__main__":
    generate_moderator_data(50)

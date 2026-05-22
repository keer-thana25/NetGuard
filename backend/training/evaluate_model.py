from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def evaluate_classifier(model, X_test_scaled, y_test) -> dict:
    """
    Computes key performance metrics for standard scikit-learn models:
    Accuracy, Precision, Recall, F1 Score, and ROC-AUC
    """
    preds = model.predict(X_test_scaled)
    
    # Try calculating prediction probabilities for AUC
    try:
        probs = model.predict_proba(X_test_scaled)[:, 1]
        auc = roc_auc_score(y_test, probs)
    except Exception:
        auc = 0.0

    metrics = {
        "Accuracy": float(accuracy_score(y_test, preds)),
        "Precision": float(precision_score(y_test, preds, zero_division=0)),
        "Recall": float(recall_score(y_test, preds, zero_division=0)),
        "F1 Score": float(f1_score(y_test, preds, zero_division=0)),
        "ROC AUC": float(auc)
    }

    return metrics

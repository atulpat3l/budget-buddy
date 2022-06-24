import React, { useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext();

const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

const useBudgets = () => {
  return useContext(BudgetsContext);
};

const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", []);

  const getBudgetExpenses = (budgetId) => {
    return expenses.filter((expense) => expense.budgetId === budgetId);
  };

  const addExpense = ({ description, amount, budgetId }) => {
    setExpenses((prev) => {
      return [...prev, { id: uuidV4(), description, amount, budgetId }];
    });
  };

  const addBudget = ({ name, max }) => {
    setBudgets((prev) => {
      if (prev.find((budget) => budget.name === name)) {
        return prev;
      }
      return [...prev, { id: uuidV4(), name, max }];
    });
  };

  const deleteBudget = ({ id }) => {
    setExpenses((prev) => {
      return prev.map((expense) => {
        if (expense.budgetId !== id) return expense;
        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });

    setBudgets((prev) => {
      return prev.filter((budget) => budget.id !== id);
    });
  };

  const deleteExpense = ({ id }) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};

export { BudgetsProvider, useBudgets, UNCATEGORIZED_BUDGET_ID };

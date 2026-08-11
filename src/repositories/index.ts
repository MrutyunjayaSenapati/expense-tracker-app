import { TransactionRepository } from './interfaces/TransactionRepository';
import { CategoryRepository } from './interfaces/CategoryRepository';
import { AccountRepository } from './interfaces/AccountRepository';
import { BudgetRepository } from './interfaces/BudgetRepository';
import { UserRepository } from './interfaces/UserRepository';

import { ApiTransactionRepository } from './api/ApiTransactionRepository';
import { ApiCategoryRepository } from './api/ApiCategoryRepository';
import { ApiAccountRepository } from './api/ApiAccountRepository';
import { ApiBudgetRepository } from './api/ApiBudgetRepository';
import { ApiUserRepository } from './api/ApiUserRepository';

// Active Repositories connected directly to FastAPI Backend (port 8000)
export const transactionRepository: TransactionRepository = new ApiTransactionRepository();
export const categoryRepository: CategoryRepository = new ApiCategoryRepository();
export const accountRepository: AccountRepository = new ApiAccountRepository();
export const budgetRepository: BudgetRepository = new ApiBudgetRepository();
export const userRepository: UserRepository = new ApiUserRepository();

export * from './interfaces/TransactionRepository';
export * from './interfaces/CategoryRepository';
export * from './interfaces/AccountRepository';
export * from './interfaces/BudgetRepository';
export * from './interfaces/UserRepository';

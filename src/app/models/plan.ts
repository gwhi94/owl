export class Plan {
    activePlan:boolean;
    dailyLeft:number;
    dateRange:object;
    days:number;
    totalDays:number;
    expenses:number;
    moneyIn:number;
    name:string;
    saving:number;
    totalLeft:number;
    weeklyLeft:number;
    
    currentSpent:number;
    currentLeft:number;
    surplus:number;
    lastUpdated:string;
    variableDailyLeft:number;
    variableWeeklyLeft:number;
    weekUpdated:string;
    excludeWeekends:boolean;
    costCategories:Array<Object>;
   
}


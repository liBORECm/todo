export enum TaskPriority {
    CRITICAL = 'critical',
    STANDARD = 'standard',
    LOW = 'low',
}

export class SimpleTaskBase {
    constructor(
        public id: number,
        public tableId: number,
        public name: string,
        public createdAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
        public deadline: Date,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public parentId: number | null,
    ) {}
}

export class SimpleTask extends SimpleTaskBase {
    constructor(
        public id: number,
        public tableId: number,
        public name: string,
        public createdAt: Date,
        public deletedAt: Date,
        public finishedAt: Date,
        public deadline: Date,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public parentId: number | null,
        public subtasks: SimpleTaskBase[],
    ) {
        super(
            id,
            tableId,
            name,
            createdAt,
            deletedAt,
            finishedAt,
            deadline,
            title,
            description,
            priority,
            parentId,
        )
    }
}

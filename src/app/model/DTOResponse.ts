export class DTOResponse {
    public id!: string
    public name!: string;
    public value!: number;
    public active!: boolean;
    public chargeType!: string;
    public invoiceUrl!: string;
    public billingType!: string;
    public subscriptionCycle!: string;
    public description!: string;
    public endDate!: Date;
    public deleted!: boolean;
    public viewCount!: number;
    public maxInstallmentCount!: number;
    public dueDateLimitDays!: number;
    public notificationEnabled!: boolean;
}

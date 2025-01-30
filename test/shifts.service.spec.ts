import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsService } from '../src/shifts/shifts.service';
import { PrismaService } from '../src/prisma.service';

describe('ShiftsService', () => {
    let service: ShiftsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ShiftsService, PrismaService],
        }).compile();

        service = module.get<ShiftsService>(ShiftsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return eligible shifts for a worker', async () => {
        const mockWorkerId = 1;
        const mockStartDate = '2023-01-01';
        const mockEndDate = '2023-12-31';

        jest.spyOn(prisma.shift, 'findMany').mockResolvedValue([
            { id: 1, facilityId: 1, active: true, claimedBy: null, startTime: new Date(mockStartDate), endTime: new Date(mockEndDate) },
        ] as any);

        const result = await service.getEligibleShifts(mockWorkerId, mockStartDate, mockEndDate);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
    });

    it('should return an empty array if no shifts are eligible', async () => {
        const mockWorkerId = 2;
        const mockStartDate = '2023-01-01';
        const mockEndDate = '2023-12-31';

        jest.spyOn(prisma.shift, 'findMany').mockResolvedValue([]);

        const result = await service.getEligibleShifts(mockWorkerId, mockStartDate, mockEndDate);
        expect(result).toEqual([]);
    });
});
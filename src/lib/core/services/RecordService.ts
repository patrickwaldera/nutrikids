import { PBRecordsRepository } from "$lib/infra/repositories_impl/PBRecordRepository";
import type { Record } from "../entities/Record";
import type { IRecordRepository } from "../repositories/RecordRepository";

export class RecordService {
	private static recordsRepository: IRecordRepository = new PBRecordsRepository();
	public static async getRecordsBySchoolIdAndMonth(token: string,	schoolId: string, month: number): Promise<Record[]> {
		try {
			return await RecordService.recordsRepository.getRecordsBySchoolIdAndMonth(token, schoolId, month);
		} catch (error) {
			throw error;
		}
	}

	public static async update(token: string, record: Record): Promise<boolean> {
		try {
			return await RecordService.recordsRepository.update(token, record);
		} catch (error) {
			throw error;
		}
	}

	public static async delete(token: string, id: string): Promise<boolean> {
		try {
			return await RecordService.recordsRepository.delete(token, id);
		} catch (error) {
			throw error;
		}
	}

	public static async create(token: string, record: Record): Promise<string> {
		try {
			return await RecordService.recordsRepository.create(token, record);
		} catch (error) {
			throw error;
		}
	}
}
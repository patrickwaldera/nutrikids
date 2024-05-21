import { PBRecordsRepository } from "$lib/infra/repositories_impl/PBRecordRepository";
import type { Record } from "../entities/Record";
import type { IRecordRepository } from "../repositories/RecordRepository";

export class RecordsService {
	private static recordsRepository: IRecordRepository = new PBRecordsRepository();
	public static async getRecordsBySchoolIdAndMonth(token: string,	schoolId: string, month: number): Promise<Record[]> {
		try {
			return await RecordsService.recordsRepository.getRecordsBySchoolIdAndMonth(token, schoolId, month);
		} catch (error) {
			throw error;
		}
	}

	public static async update(token: string, record: Record): Promise<boolean> {
		try {
			return await RecordsService.recordsRepository.update(token, record);
		} catch (error) {
			throw error;
		}
	}

	public static async delete(token: string, id: string): Promise<boolean> {
		try {
			return await RecordsService.recordsRepository.delete(token, id);
		} catch (error) {
			throw error;
		}
	}
}
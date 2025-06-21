import { QuestionStatus } from "@/quiz/types";
import { createTestQuizQuestion } from "../../testing/testUtils";
import { ImageType, useImageDisplay } from "../useImageDisplay";

const IMAGE_URL = 1;
const THUMBNAIL_URL = 2;
const UNSOLVED_IMAGE_URL = 3;
const UNSOLVED_THUMBNAIL_URL = 4;

// Mock für React hooks
const mockUseMemo = jest.fn();
jest.mock("react", () => ({
	useMemo: (fn: () => any, deps: any[]) => mockUseMemo(fn, deps),
}));

describe("useImageDisplay Hook", () => {
	beforeEach(() => {
		// Reset mocks before each test
		mockUseMemo.mockImplementation((fn, deps) => fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getImageUrl", () => {
		it("should return unsolved image when question is unsolved and unsolved image exists", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.IMG)).toBe(UNSOLVED_IMAGE_URL);
		});

		it("should return regular image when question is solved", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.SOLVED,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.IMG)).toBe(IMAGE_URL);
		});

		it("should return regular image when unsolved image does not exist", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: undefined,
					unsolvedThumbnailUrl: undefined,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.IMG)).toBe(IMAGE_URL);
		});

		it("should return unsolved thumbnail when question is unsolved and unsolved thumbnail exists", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(UNSOLVED_THUMBNAIL_URL);
		});

		it("should return regular thumbnail when question is solved", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.SOLVED,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(THUMBNAIL_URL);
		});

		it("should fallback to regular image when thumbnail does not exist", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.SOLVED,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: undefined,
					unsolvedImageUrl: undefined,
					unsolvedThumbnailUrl: undefined,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(IMAGE_URL);
		});

		it("should fallback to regular thumbnail when unsolved thumbnail does not exist", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: undefined,
					unsolvedThumbnailUrl: undefined,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(THUMBNAIL_URL);
		});

		it("should handle default test question from testUtils", () => {
			const question = createTestQuizQuestion(); // Standard TestQuestion

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			// Default status ist ACTIVE, keine unsolved images
			expect(getImageUrl(ImageType.IMG)).toBe(4);
			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(5);
		});
	});

	describe("shouldShowUnsolvedImage", () => {
		it("should return true when question is active and unsolved image exists", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: undefined,
				},
			});

			const { shouldShowUnsolvedImage } = useImageDisplay(question.images, question.status);

			expect(shouldShowUnsolvedImage).toBe(true);
		});

		it("should return true when question is active and unsolved thumbnail exists", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: undefined,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { shouldShowUnsolvedImage } = useImageDisplay(question.images, question.status);

			expect(shouldShowUnsolvedImage).toBe(true);
		});

		it("should return false when question is solved", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.SOLVED,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { shouldShowUnsolvedImage } = useImageDisplay(question.images, question.status);

			expect(shouldShowUnsolvedImage).toBe(false);
		});

		it("should return false when question is active but no unsolved images exist", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: undefined,
					unsolvedThumbnailUrl: undefined,
				},
			});

			const { shouldShowUnsolvedImage } = useImageDisplay(question.images, question.status);

			expect(shouldShowUnsolvedImage).toBe(false);
		});

		it("should return false for default test question (no unsolved images)", () => {
			const question = createTestQuizQuestion(); // Standard TestQuestion

			const { shouldShowUnsolvedImage } = useImageDisplay(question.images, question.status);

			expect(shouldShowUnsolvedImage).toBe(false);
		});
	});

	describe("useMemo dependencies", () => {
		it("should call useMemo with correct dependencies for createImageSelector", () => {
			const question = createTestQuizQuestion();

			useImageDisplay(question.images, question.status);

			// Check first useMemo call (createImageSelector)
			expect(mockUseMemo).toHaveBeenNthCalledWith(1, expect.any(Function), [
				question.images,
			]);
		});

		it("should call useMemo with correct dependencies for shouldShowUnsolvedImage", () => {
			const question = createTestQuizQuestion();

			useImageDisplay(question.images, question.status);

			// Check second useMemo call (shouldShowUnsolvedImage)
			expect(mockUseMemo).toHaveBeenNthCalledWith(2, expect.any(Function), [
				question.status,
				question.images.unsolvedImageUrl,
				question.images.unsolvedThumbnailUrl,
			]);
		});

		it("should call useMemo with correct dependencies for getImageUrl", () => {
			const question = createTestQuizQuestion();

			useImageDisplay(question.images, question.status);

			// Check third useMemo call (getImageUrl)
			expect(mockUseMemo).toHaveBeenNthCalledWith(
				3,
				expect.any(Function),
				expect.any(Array),
			);
		});
	});

	describe("edge cases", () => {
		it("should handle null/undefined image URLs gracefully", () => {
			const question = createTestQuizQuestion({
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: null as any,
					unsolvedImageUrl: null as any,
					unsolvedThumbnailUrl: null as any,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(() => {
				getImageUrl(ImageType.IMG);
				getImageUrl(ImageType.THUMBNAIL);
			}).not.toThrow();
		});

		it("should work with different QuestionStatus values", () => {
			const statuses = [QuestionStatus.SOLVED, QuestionStatus.ACTIVE];

			for (const status of statuses) {
				const question = createTestQuizQuestion({ status });

				expect(() => {
					const { getImageUrl } = useImageDisplay(question.images, question.status);
					getImageUrl(ImageType.IMG);
					getImageUrl(ImageType.THUMBNAIL);
				}).not.toThrow();
			}
		});

		it("should handle minimal question data", () => {
			const MINMAL = 5;
			const question = createTestQuizQuestion({
				images: {
					imageUrl: MINMAL,
				},
			});

			const { getImageUrl, shouldShowUnsolvedImage } =
				useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.IMG)).toBe(MINMAL);
			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(MINMAL); // Fallback
			expect(shouldShowUnsolvedImage).toBe(false);
		});
	});

	describe("closure behavior", () => {
		it("should maintain consistent behavior across multiple calls", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			// Multiple calls should return same result
			const firstCall = getImageUrl(ImageType.IMG);
			const secondCall = getImageUrl(ImageType.IMG);

			expect(firstCall).toBe(secondCall);
			expect(firstCall).toBe(UNSOLVED_IMAGE_URL);
		});

		it("should handle both ImageType values correctly", () => {
			const question = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: IMAGE_URL,
					thumbnailUrl: THUMBNAIL_URL,
					unsolvedImageUrl: UNSOLVED_IMAGE_URL,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL_URL,
				},
			});

			const { getImageUrl } = useImageDisplay(question.images, question.status);

			expect(getImageUrl(ImageType.IMG)).toBe(UNSOLVED_IMAGE_URL);
			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(UNSOLVED_THUMBNAIL_URL);
		});

		it("should work with default test question setup", () => {
			const question = createTestQuizQuestion();

			const { getImageUrl, shouldShowUnsolvedImage } =
				useImageDisplay(question.images, question.status);

			// Test default behavior
			expect(shouldShowUnsolvedImage).toBe(false);
			expect(getImageUrl(ImageType.IMG)).toBe(4);
			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(5);
		});
	});

	describe("integration with testUtils patterns", () => {
		it("should work with different question statuses from testUtils", () => {
			const activeQuestion = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
			});
			const solvedQuestion = createTestQuizQuestion({
				status: QuestionStatus.SOLVED,
			});

			const activeResult = useImageDisplay(activeQuestion.images, activeQuestion.status);
			const solvedResult = useImageDisplay(solvedQuestion.images, solvedQuestion.status);

			expect(activeResult.shouldShowUnsolvedImage).toBe(false); // keine unsolved images in default
			expect(solvedResult.shouldShowUnsolvedImage).toBe(false);
		});

		it("should handle complex image configurations", () => {
			const SOLVED_IMG = 6;
			const SOLVED_THUMBNAIL = 7;
			const UNSOLVED_IMG = 8;
			const UNSOLVED_THUMBNAIL = 9;
			const questionWithUnsolvedImages = createTestQuizQuestion({
				status: QuestionStatus.ACTIVE,
				images: {
					imageUrl: SOLVED_IMG,
					thumbnailUrl: SOLVED_THUMBNAIL,
					unsolvedImageUrl: UNSOLVED_IMG,
					unsolvedThumbnailUrl: UNSOLVED_THUMBNAIL,
				},
			});

			const { getImageUrl, shouldShowUnsolvedImage } = useImageDisplay(
				questionWithUnsolvedImages.images, questionWithUnsolvedImages.status
			);

			expect(shouldShowUnsolvedImage).toBe(true);
			expect(getImageUrl(ImageType.IMG)).toBe(UNSOLVED_IMG);
			expect(getImageUrl(ImageType.THUMBNAIL)).toBe(UNSOLVED_THUMBNAIL);
		});
	});
});

export default class MathUtils {
    public static GRAVITY_ACCELERATION = 9.81

    private static LBS_NEWTONS_CONVERSION_UNIT = 4.4482

    public static lbs2mass = (lbs: number): number => {
        return lbs * MathUtils.LBS_NEWTONS_CONVERSION_UNIT / MathUtils.GRAVITY_ACCELERATION
    }

    public static inches2meters = (inches: number): number => {
        return inches / 39.37
    }

    public static clamp = (value: number, lower: number, upper: number): number => {
        return Math.max(
            Math.min(value, upper),
            lower
        )
    }
}

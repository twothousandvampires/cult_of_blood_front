export default class LocalMath{
    static degreeToRadians(degree){
        let pi = Math.PI;
        return degree * pi / 180;
    }
    static radiansToDegrees(radians){
        return 180 * radians / Math.PI;
    }

}
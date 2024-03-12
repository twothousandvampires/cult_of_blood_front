export default class LocalMath{
    static degreeToRadians(degree){
        let pi = Math.PI;
        return degree * pi / 180;
    }
    static radiansToDegrees(radians){
        return 180 * radians / Math.PI;
    }
    static distance(from, to){
        return Math.sqrt(((from.x - to.x) ** 2) + ((from.y - to.y) ** 2))
    }
}
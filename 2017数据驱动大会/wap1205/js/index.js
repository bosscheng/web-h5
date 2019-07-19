/**
 * date: 2017/12/5
 * author:
 * desc:
 */
$(function () {
    window.addEventListener('deviceorientation', orientationListener, false);
    function orientationListener(evt) {
        evt.gamma = (evt.x * (180 / Math.PI));  //转换成角度值
        evt.beta = (evt.y * (180 / Math.PI));
        evt.alpha = (evt.z * (180 / Math.PI));

        var gamma = evt.gamma;
        var beta = evt.beta;
        var alpha = evt.alpha;

        if (evt.accelerationIncludingGravity) {
            window.removeEventListener('deviceorientation', this.orientationListener, false);
            gamma = event.accelerationIncludingGravity.x * 10;
            beta = -event.accelerationIncludingGravity.y * 10;
            alpha = event.accelerationIncludingGravity.z * 10;
        }

        if (this._lastGamma != gamma || this._lastBeta != beta) {

            gamma = gamma.toFixed(0);
            beta = beta.toFixed(0);
            alpha = alpha !== null ? alpha.toFixed(0) : 0;

            // 大于 60  小于 90
            if (gamma > 60 && gamma < 90) {
                gamma = 60;
            }

            //
            else if (gamma > -90 && gamma < -60) {
                gamma = -60;
            }
            //
            else if (gamma <= -90 || gamma >= 90) {
                gamma = 0;
            }

            if (beta > 0) {
                var x = gamma + 'px';
                var y = gamma + 'px';

                if (gamma < 0) {
                    y = -gamma + 'px';
                }

                $('.m-page.show').css({
                    '-webkit-transform': 'translate(' + x + ',' + y + ')'
                });

                console.log(beta, gamma, alpha)
            }

            this._lastGamma = gamma;
            this._lastBeta = beta;
        }
    }
});

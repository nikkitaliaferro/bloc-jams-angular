(function() {
    function seekBar($document) {

    /**
    * @function calculatePercent
    * @desc calculates horizontal % along seek bar where event has occured
    * @param number
    **/

    var calculatePercent = function(seekBar, event) {
        var offsetX = event.pageX - seekBar.offset().left;
        var seekBarWidth = seekBar.width();
        var offsetXPercent = offsetX / seekBarWidth;
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(1, offsetXPercent);
        return offsetXPercent;
    };
        
    return {
        templateUrl: '/templates/directives/seek_bar.html',
        replace: true,
        restrict: 'E',
        scope: {
            onChange: '&'
        },
        link: function(scope, element, attributes) {
            scope.value = 0;
            scope.max = 100;

            var seekBar = $(element);


            attributes.$observe('value', function(newValue) {
                scope.value = newValue;
            });

            attributes.$observe('max', function(newValue) {
                scope.max = newValue;
            });

            var percentString = function() {
                var value = scope.value;
                var max = scope.max;
                var percent = value / max * 100;
                return percent + "%";
            };

            scope.fillStyle = function() {
                return {width: percentString()};
            };

            // 9.1 - Assignment - method that updates the position of the seek bar thumb
            scope.thumbStyle = function() {
                return {left: percentString()};
            };

            var notifyOnChange = function(newValue) {
                if (typeof scope.onChange === 'function') {
                    scope.onChange({value: newValue});
                }
            };

            /**
            * @desc Updates seek bar values based on click
            * @type
            **/
            scope.onClickSeekBar = function(event) {
                var percent = calculatePercent(seekBar, event);
                scope.value = percent * scope.max;
                notifyOnChange(scope.value);
            };

            /**
            * @desc Updates seek bar values based on draging thumb
            *
            **/
            scope.trackThumb = function() {
                $document.bind('mousemove.thumb', function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.$apply(function() {
                        scope.value = percent * scope.max;
                        notifyOnChange(scope.value);
                    });

                });

                $document.bind('mouseup.thumb', function() {
                    $document.unbind('mousemove.thumb');
                    $document.unbind('mouseup.thumb');
                });
            };
        }
    };
}

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();
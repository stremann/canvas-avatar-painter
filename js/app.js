'use strict';

( function( window, $ ) {

    window.addEventListener( 'load', function () {

        var Avatar = function( options ) {

            var defaultOptions = {
                viewportEl: $( '.js-CA-viewport' )[ 0 ],
                dropDownMenuEl: $( '.js-CA-dropDownMenu' )[ 0 ],
                paletteEl: $( '.js-CA-palette' )[ 0 ],

                clearButton: $( '.js-CA-clearButton' )[ 0 ],
                exportButton: $( '.js-CA-exportButton' )[ 0 ],
                importButton: $( '.js-CA-importButton' )[ 0 ],
                maleTemplateButton: $( '.js-CA-maleTemplate' )[ 0 ],
                femaleTemplateButton: $( '.js-CA-femaleTemplate' )[ 0 ],

                strokeColor: '#000000',
                headerHeight: 48,
                footerHeight: 48
            };

            this.mousedown = false;
            this.options = $.extend( defaultOptions, options );

            this.init();
        };

        $.extend( Avatar.prototype, {

            init: function() {
                this.createCanvas();
            },

            bindEvents: function() {
                this.options.canvasEl.onmousedown = this.startDraw.bind( this );
                this.options.canvasEl.onmousemove = this.moveDraw.bind( this );
                this.options.canvasEl.onmouseup = this.stopDraw.bind( this );

                this.options.paletteEl.onclick = this.selectColor.bind( this );
                this.options.clearButton.onclick = this.clearCanvas.bind( this );
                this.options.exportButton.onclick = this.exportImage.bind( this );
                this.options.importButton.onclick = this.toggleDropDownMenu.bind( this );
                this.options.maleTemplateButton.onclick = this.importImage.bind( this, 'male' );
                this.options.femaleTemplateButton.onclick = this.importImage.bind( this, 'female' );
            },

            createCanvas: function() {
                this.canvasHeight = $( window ).height() - ( this.options.headerHeight + this.options.footerHeight );
                $( this.options.viewportEl ).height( this.canvasHeight );
                this.canvas = '<canvas width="' + $( window ).width() + '" height="' + this.canvasHeight + '"></canvas>';
                $( this.options.viewportEl ).html( this.canvas );
                this.options.canvasEl = $( 'canvas' )[ 0 ];

                this.setupCanvas();
                this.bindEvents();
            },

            setupCanvas: function() {
                this.context = this.options.canvasEl.getContext( '2d' );
                this.context.strokeStyle = this.options.strokeColor;
                this.context.lineWidth = this.options.lineWidthValue;
            },

            clearCanvas: function() {
                this.context.clearRect( 0, 0, this.options.canvasEl.width, this.options.canvasEl.height );
            },

            startDraw: function( event ) {
                var xCoord, yCoord;

                xCoord = event.pageX;
                yCoord = event.pageY - this.options.headerHeight;

                this.mousedown = true;
                this.context.beginPath();
                this.context.moveTo( xCoord, yCoord );
            },

            moveDraw: function( event ) {
                var xCoord, yCoord;

                if( this.mousedown ) {
                    xCoord = event.pageX;
                    yCoord = event.pageY - this.options.headerHeight;

                    this.context.lineTo( xCoord, yCoord );
                    this.context.stroke();
                }
            },

            stopDraw: function() {
                this.mousedown = false;
            },

            selectColor: function( event ) {
                this.$targetColor = $( event.target );
                this.activeItems = $( '.CA-palette-item_active' );
                this.activeItems.removeClass( 'CA-palette-item_active' );
                this.$targetColor.addClass( 'CA-palette-item_active' );
                this.options.strokeColor = this.$targetColor.css( 'background-color' );
                this.context.strokeStyle = this.options.strokeColor;
            },

            toggleDropDownMenu: function () {
                $( this.options.dropDownMenuEl ).toggleClass( 'CA-dropDownMenu_active' );
                $( this.options.importButton ).toggleClass( 'CA-navigation__button_active' );
            },

            exportImage: function( event ) {
                var imageData;

                imageData = this.options.canvasEl.toDataURL( 'image/png' );
                event.target.href = imageData;
                event.target.download = 'avatar.png';

            },

            importImage: function( type ) {
                var self, image;

                self = this;
                image = new Image();
                image.src = './img/' + type + '.png';

                if( image.src ) {
                    image.onload = function () {
                        self.context.drawImage( image, 50, 30 );
                    };
                }
            }

        } );

        window.modules = window.modules || {};
        window.modules.Avatar = new Avatar( {
            lineWidthValue: 5
        } );

    } );

} )( window, jQuery );
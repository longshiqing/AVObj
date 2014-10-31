/*
 * Copyright (c) 2014 Ian Carson - LinkedIn http://lnkd.in/9qJWap
 *
 * Project : AVObj - Making JS Simple.
 * Version : 0.6.1
 * License : MIT (http://www.opensource.org/licenses/mit-license.php)
 *
 * For the latest updates go to http://AVObject.net
 * Visit the wiki for howto information on getting started at https://github.com/Kabe0/AVObj/wiki
 */

/**
 * Created by Ian on 2014-10-28.
 */

namespace( "AVApp.Display", function()
{
	/**
	 * The base View class can handle loading objects as it has
	 */
	this.View = AVObj.extend().prop(
		{
			init : function()
			{

			},

			/**
			 * Can push in a fade effect when running a layer using LayerTransitionBase objects.
			 *
			 * @param {LayerTransitionBase|Layer} newLayer Either a LayerTransitionBase or Layer object.
			 */
			pushLayer : function( newLayer )
			{

			},

			popLayer : function()
			{

			},

			swapLayer : function()
			{

			}
		}
	)

});
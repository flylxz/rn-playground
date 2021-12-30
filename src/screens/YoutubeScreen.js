import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import YoutubePlayer from 'react-native-youtube-iframe';

const HANDLE_WIDTH = 25;

export const YoutubeScreen = () => {
  const playerRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [isMute, setMute] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(null);
  const [barWidth, setBarWidth] = useState(null);

  const sliderWidth = useSharedValue(0);
  const progress = useSharedValue(0);
  const indicatorScale = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsed_sec = await playerRef.current.getCurrentTime(); // this is a promise. dont forget to await
      const time = formateTime(elapsed_sec);
      const currentPercent = (num1, num2) => {
        const percent = ((num1 / num2) * 100).toFixed(0);
        const prgr = (percent * num2) / 100;
        if (prgr) {
          progress.value = prgr;
        }
      };
      currentPercent(elapsed_sec, totalDuration);
      setElapsed(time);
    }, 200); // 100 ms refresh. increase it if you don't require millisecond precision

    if (!playing) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log(animatedProgress, '+++++');
  }, [progress.value, animatedProgress]);

  const formateTime = time => {
    const elapsed_ms = Math.floor(time * 1000);
    const ms = elapsed_ms % 1000;
    const min = Math.floor(elapsed_ms / 60000);
    const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);

    return (
      min.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0') +
      ':' +
      ms.toString().padStart(3, '0')
    );
  };

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const seekBackAndForth = control => {
    playerRef.current?.getCurrentTime().then(currentTime => {
      control === 'forward'
        ? playerRef.current?.seekTo(currentTime + 15, true)
        : playerRef.current?.seekTo(currentTime - 15, true);
    });
  };
  const seekOnTouch = value => {
    const time = (value * totalDuration) / sliderWidth.value;
    playerRef.current?.seekTo(time);
  };

  const muteVideo = () => setMute(mute => !mute);

  const animatedSliderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value - HANDLE_WIDTH / 2,
      },
      { scale: indicatorScale.value },
    ],
  }));

  const animatedProgress = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      indicatorScale.value = withSpring(1.5);
      ctx.startProgress = progress.value;
    },
    onActive: (e, ctx) => (progress.value = ctx.startProgress + e.translationX),
    onEnd: () => {
      indicatorScale.value = withSpring(1);
      if (progress.value > sliderWidth.value) {
        progress.value = withSpring(sliderWidth.value);
        runOnJS(seekOnTouch)(progress.value);
      } else if (sliderWidth.value < 0) {
        progress.value = withSpring(0);
        runOnJS(seekOnTouch)(0);
      }
      runOnJS(seekOnTouch)(progress.value);
    },
  });

  return (
    <View style={styles.container}>
      {/* <Pressable
        onPress={() => {
          // handle or ignore
        }}
        onLongPress={() => {
          // handle or ignore
        }}>
        <View pointerEvents="none"> */}
      <YoutubePlayer
        // startInLoadingState={true}
        // onShouldStartLoadWithRequest={false}
        ref={playerRef}
        webViewStyle={styles.webview}
        height={250}
        play={playing}
        videoId={'WhWc3b3KhnY'}
        mute={isMute}
        onChangeState={onStateChange}
        onError={e => console.log('error-----', e)}
        onPlaybackQualityChange={e => console.log('status----', e)}
        onReady={e =>
          playerRef.current.getDuration().then(time => {
            console.log('totalduration--', time);
            setTotalDuration(time);
          })
        }
        fullscreen={true}
      />
      {/* </View>
      </Pressable> */}

      <View
        style={styles.seekBar}
        onLayout={e => (sliderWidth.value = e.nativeEvent.layout.width)}>
        <Animated.View style={[styles.activeBar, animatedProgress]} />
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View
            style={[
              styles.indicator,
              animatedSliderStyle,
              // animatedIndicatorStyle,
            ]}
          />
        </PanGestureHandler>
      </View>

      <View style={styles.row}>
        <Text style={{ flex: 1, color: 'black' }}>{'elapsed time'}</Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          <Text style={{ color: 'green' }}>{elapsed}/</Text>
          <Text style={{ color: 'black', marginRight: 30 }}>
            {formateTime(totalDuration)}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Button title="back" onPress={() => seekBackAndForth('rewind')} />
        <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
        <Button title="ff" onPress={() => seekBackAndForth('forward')} />
      </View>

      <Button title={isMute ? 'unmute' : 'mute'} onPress={muteVideo} />

      <Button
        title="log details"
        onPress={() => {
          playerRef.current
            ?.getCurrentTime()
            .then(currentTime => console.log({ currentTime }));

          playerRef.current
            ?.getDuration()
            .then(getDuration => console.log({ getDuration }));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seekBar: {
    // position: 'absolute',
    marginHorizontal: 20,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'grey',
    // width: '100%',
    height: 10,
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'orange',
    // width: '40%',
    height: 10,
    zIndex: 1,
  },
  indicator: {
    // position: 'absolute',
    // left: 150,
    backgroundColor: 'white',
    height: HANDLE_WIDTH,
    width: HANDLE_WIDTH,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    zIndex: 2,
  },
  webview: {
    // flex: 1,
    // height: 300,
    // borderColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  btn: {
    backgroundColor: 'beige',
    padding: 50,
    margin: 15,
    borderRadius: 20,
  },
  text: {
    color: 'grey',
  },
});

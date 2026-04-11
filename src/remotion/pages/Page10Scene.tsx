import {
  clamp01,
  easeInOutCubic,
  easeOutQuint,
  horizontalPath,
  mix,
  polylinePath,
  verticalPath,
} from "../geometry/geometry";
import type {SceneModel} from "../model/scene-model-types";
import {
  CalloutBadge,
  PixelGrid,
  StageBox,
  StrokeArrow,
  VertexTriangles,
} from "../primitives/diagramPrimitives";

const COMPUTER_BOX = {x: 88, y: 220, width: 186, height: 104, radius: 28};
const COOK_BOX = {x: 352, y: 246, width: 156, height: 78, radius: 22};
const BYTECODE_BOX = {x: 568, y: 188, width: 240, height: 72, radius: 22};
const SCL_BOX = {x: 568, y: 304, width: 240, height: 72, radius: 22};
const PHONE_BOX = {x: 941, y: 126, width: 206, height: 414, radius: 44};
const RUNTIME_BOX = {x: 969, y: 230, width: 150, height: 204, radius: 30};

function centerX(box: {x: number; width: number}) {
  return box.x + box.width / 2;
}

function centerY(box: {y: number; height: number}) {
  return box.y + box.height / 2;
}

function right(box: {x: number; width: number}) {
  return box.x + box.width;
}

function bottom(box: {y: number; height: number}) {
  return box.y + box.height;
}

export function Page10Scene({scene}: {scene: SceneModel}) {
  const progress = scene.settledPage910Progress ?? 0;
  const recallOpacity = 1 - clamp01((progress - 0.2) / 0.16);
  const questionReveal = clamp01((progress - 0.1) / 0.12);
  const questionExit = 1 - clamp01((progress - 0.3) / 0.1);
  const questionOpacity = questionReveal * questionExit;
  const questionScale = mix(0.84, 1.04, easeOutQuint(questionReveal));
  const answerReveal = clamp01((progress - 0.28) / 0.14);
  const answerExit = 1 - clamp01((progress - 0.76) / 0.12);
  const answerOpacity = answerReveal * answerExit;
  const answerScale = mix(0.76, 1.18, easeOutQuint(answerReveal)) * mix(1, 0.88, 1 - answerExit);
  const finalProgress = clamp01((progress - 0.36) / 0.3);
  const finalOpacity = easeInOutCubic(finalProgress);
  const fileSplitProgress = clamp01((progress - 0.46) / 0.24);
  const phoneReveal = clamp01((progress - 0.5) / 0.22);

  if (progress <= 0.001) {
    return null;
  }

  return (
    <>
      {recallOpacity > 0.001 ? (
        <>
          <VertexTriangles
            cx={scene.leftCenterX}
            cy={scene.page5VertexIconY}
            opacity={recallOpacity}
            scale={mix(1, 0.84, progress)}
          />
          <text
            x={scene.centerCenterX}
            y={scene.centerTextY}
            fill="#22303d"
            fontSize="48"
            fontWeight="760"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity={recallOpacity}
          >
            GPU
          </text>
          <PixelGrid
            x={scene.pixelGridX}
            y={scene.pixelGridY}
            opacity={recallOpacity}
            scale={mix(1, 0.8, progress)}
            revealProgress={1}
          />
          <g opacity={recallOpacity}>
            <StageBox
              box={scene.sharedUpperLeftBox}
              fill={scene.assetFill}
              stroke={scene.assetStroke}
              strokeWidth={2.8}
              tone="asset"
              label="Material"
              labelSize={24}
              labelWeight={730}
            />
            <StageBox
              box={scene.sharedUpperRightBox}
              fill={scene.focusFill}
              stroke={scene.theme.accent}
              strokeWidth={2.8}
              label="Cooked"
              labelSize={23}
              labelWeight={760}
            />
            <StageBox
              box={scene.page5BinaryTargetBox}
              fill={scene.focusFill}
              stroke={scene.theme.accent}
              strokeWidth={2.8}
              label="Binary"
              labelSize={23}
              labelWeight={760}
            />
            <StrokeArrow
              d={horizontalPath(
                right(scene.sharedUpperLeftBox) + 10,
                scene.sharedUpperRightBox.x - 10,
                centerY(scene.sharedUpperLeftBox),
              )}
              stroke={scene.assetStroke}
              opacity={recallOpacity}
              tipX={scene.sharedUpperRightBox.x - 10}
              tipY={centerY(scene.sharedUpperLeftBox)}
              direction="right"
              shaftWidth={3}
              underlayWidth={5.6}
              underlayOpacity={0.12}
              headSize={9}
            />
            <StrokeArrow
              d={verticalPath(
                centerX(scene.sharedUpperRightBox),
                bottom(scene.sharedUpperRightBox) + 8,
                scene.page5BinaryTargetBox.y - 8,
              )}
              stroke={scene.assetStroke}
              opacity={recallOpacity}
              tipX={centerX(scene.sharedUpperRightBox)}
              tipY={scene.page5BinaryTargetBox.y - 8}
              direction="down"
              shaftWidth={3}
              underlayWidth={5.6}
              underlayOpacity={0.12}
              headSize={9}
            />
          </g>
        </>
      ) : null}

      {answerOpacity > 0.001 ? (
        <g
          opacity={answerOpacity}
          transform={`translate(${scene.page56QuestionCenterX} ${scene.page56QuestionCenterY}) scale(${answerScale}) translate(${-scene.page56QuestionCenterX} ${-scene.page56QuestionCenterY})`}
        >
          <CalloutBadge
            testId="page10-answer-badge"
            x={scene.page56QuestionCenterX}
            y={scene.page56QuestionCenterY}
            label="!"
            stroke={scene.apiStroke}
            fill="rgba(255, 248, 242, 0.98)"
            radius={16}
          />
        </g>
      ) : null}

      {questionOpacity > 0.001 ? (
        <g
          opacity={questionOpacity}
          transform={`translate(${scene.page56QuestionCenterX} ${scene.page56QuestionCenterY}) scale(${questionScale}) translate(${-scene.page56QuestionCenterX} ${-scene.page56QuestionCenterY})`}
        >
          <CalloutBadge
            x={scene.page56QuestionCenterX}
            y={scene.page56QuestionCenterY}
            label="?"
            stroke={scene.apiStroke}
            fill="rgba(255, 248, 242, 0.98)"
            radius={14}
          />
        </g>
      ) : null}

      {finalOpacity > 0.001 ? (
        <g opacity={finalOpacity}>
          <g>
            <rect
              x={COMPUTER_BOX.x + 18}
              y={bottom(COMPUTER_BOX) + 14}
              width={COMPUTER_BOX.width - 36}
              height="14"
              rx="7"
              fill="rgba(34, 48, 61, 0.14)"
            />
            <rect
              x={centerX(COMPUTER_BOX) - 16}
              y={bottom(COMPUTER_BOX) - 2}
              width="32"
              height="22"
              rx="8"
              fill="rgba(34, 48, 61, 0.14)"
            />
            <StageBox
              box={COMPUTER_BOX}
              fill="rgba(247, 242, 234, 0.98)"
              stroke={scene.nodeStroke}
              strokeWidth={2.8}
              label="Computer"
              labelSize={24}
              labelWeight={740}
            />
          </g>

          <StageBox
            box={COOK_BOX}
            fill={scene.assetFill}
            stroke={scene.assetStroke}
            strokeWidth={2.8}
            tone="asset"
            label="cook"
            labelSize={26}
            labelWeight={760}
          />

          <text
            x={centerX(BYTECODE_BOX)}
            y={BYTECODE_BOX.y - 28}
            fill={scene.apiStroke}
            fontSize="16"
            fontWeight="800"
            letterSpacing="0.04em"
            textAnchor="middle"
          >
            UE5 formats
          </text>

          <g
            transform={`translate(${centerX(BYTECODE_BOX)} ${centerY(BYTECODE_BOX)}) scale(${mix(
              0.9,
              1,
              easeInOutCubic(fileSplitProgress),
            )}) translate(${-centerX(BYTECODE_BOX)} ${-centerY(BYTECODE_BOX)})`}
          >
            <StageBox
              box={BYTECODE_BOX}
              fill={scene.focusFill}
              stroke={scene.theme.accent}
              strokeWidth={2.8}
              label=".shaderbytecode"
              labelSize={22}
              labelWeight={760}
            />
          </g>

          <g
            transform={`translate(${centerX(SCL_BOX)} ${centerY(SCL_BOX)}) scale(${mix(
              0.9,
              1,
              easeInOutCubic(fileSplitProgress),
            )}) translate(${-centerX(SCL_BOX)} ${-centerY(SCL_BOX)})`}
          >
            <StageBox
              box={SCL_BOX}
              fill="rgba(255, 251, 246, 0.98)"
              stroke={scene.nodeStroke}
              strokeWidth={2.6}
              label=".scl.csv"
              labelSize={24}
              labelWeight={760}
            />
          </g>

          <StrokeArrow
            d={horizontalPath(right(COMPUTER_BOX) + 12, COOK_BOX.x - 10, centerY(COMPUTER_BOX))}
            stroke={scene.wireStroke}
            opacity={finalOpacity}
            tipX={COOK_BOX.x - 10}
            tipY={centerY(COMPUTER_BOX)}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />

          <StrokeArrow
            d={polylinePath([
              {x: right(COOK_BOX) + 10, y: centerY(COOK_BOX)},
              {x: BYTECODE_BOX.x - 30, y: centerY(COOK_BOX)},
              {x: BYTECODE_BOX.x - 30, y: centerY(BYTECODE_BOX)},
              {x: BYTECODE_BOX.x - 8, y: centerY(BYTECODE_BOX)},
            ])}
            stroke={scene.assetStroke}
            opacity={finalOpacity}
            tipX={BYTECODE_BOX.x - 8}
            tipY={centerY(BYTECODE_BOX)}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />

          <StrokeArrow
            d={polylinePath([
              {x: right(COOK_BOX) + 10, y: centerY(COOK_BOX)},
              {x: SCL_BOX.x - 30, y: centerY(COOK_BOX)},
              {x: SCL_BOX.x - 30, y: centerY(SCL_BOX)},
              {x: SCL_BOX.x - 8, y: centerY(SCL_BOX)},
            ])}
            stroke={scene.assetStroke}
            opacity={finalOpacity}
            tipX={SCL_BOX.x - 8}
            tipY={centerY(SCL_BOX)}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />

          <g
            data-testid="page10-phone-shell"
            transform={`translate(${centerX(PHONE_BOX)} ${centerY(PHONE_BOX)}) scale(${mix(
              0.92,
              1,
              easeInOutCubic(phoneReveal),
            )}) translate(${-centerX(PHONE_BOX)} ${-centerY(PHONE_BOX)})`}
          >
            <rect
              x={PHONE_BOX.x}
              y={PHONE_BOX.y}
              width={PHONE_BOX.width}
              height={PHONE_BOX.height}
              rx={PHONE_BOX.radius}
              fill="rgba(255, 252, 247, 0.92)"
              stroke="rgba(34, 48, 61, 0.22)"
              strokeWidth="2.2"
            />
            <rect
              x={centerX(PHONE_BOX) - 28}
              y={PHONE_BOX.y + 16}
              width="56"
              height="7"
              rx="3.5"
              fill="rgba(34, 48, 61, 0.14)"
            />
            <StageBox
              box={RUNTIME_BOX}
              fill="rgba(247, 239, 229, 0.98)"
              stroke={scene.apiStroke}
              strokeWidth={2.8}
              label="Runtime"
              labelSize={24}
              labelWeight={760}
            />
            <VertexTriangles
              cx={centerX(RUNTIME_BOX)}
              cy={RUNTIME_BOX.y + 56}
              opacity={0.84}
              scale={0.42}
            />
          </g>

          <StrokeArrow
            d={polylinePath([
              {x: right(BYTECODE_BOX) + 12, y: centerY(BYTECODE_BOX)},
              {x: RUNTIME_BOX.x - 48, y: centerY(BYTECODE_BOX)},
              {x: RUNTIME_BOX.x - 48, y: RUNTIME_BOX.y + 64},
              {x: RUNTIME_BOX.x - 10, y: RUNTIME_BOX.y + 64},
            ])}
            stroke={scene.apiStroke}
            opacity={finalOpacity}
            tipX={RUNTIME_BOX.x - 10}
            tipY={RUNTIME_BOX.y + 64}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.6}
            underlayOpacity={0.12}
            headSize={9}
          />

          <StrokeArrow
            d={polylinePath([
              {x: right(SCL_BOX) + 12, y: centerY(SCL_BOX)},
              {x: RUNTIME_BOX.x - 48, y: centerY(SCL_BOX)},
              {x: RUNTIME_BOX.x - 48, y: RUNTIME_BOX.y + 138},
              {x: RUNTIME_BOX.x - 10, y: RUNTIME_BOX.y + 138},
            ])}
            stroke={scene.wireStroke}
            opacity={finalOpacity}
            tipX={RUNTIME_BOX.x - 10}
            tipY={RUNTIME_BOX.y + 138}
            direction="right"
            shaftWidth={3}
            underlayWidth={5.4}
            underlayOpacity={0.12}
            headSize={9}
          />
        </g>
      ) : null}
    </>
  );
}

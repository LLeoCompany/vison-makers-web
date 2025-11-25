/**
 * 슬랙 메시지 템플릿
 */

import type {
  SlackNotificationData,
  SlackMessage,
  ErrorNotificationData,
  DailySummaryData
} from '@/types/slack';

// 관리자 페이지 URL 생성
function getAdminUrl(consultationNumber?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  if (consultationNumber) {
    return `${baseUrl}/admin/consultations?search=${consultationNumber}`;
  }
  return `${baseUrl}/admin/dashboard`;
}

// 한국 시간으로 포맷팅
function formatKoreanTime(dateString: string): string {
  return new Date(dateString).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 프로젝트 타입 한글 변환
function getProjectTypeKorean(type: string): string {
  const typeMap: Record<string, string> = {
    'web_development': '웹사이트 제작',
    'mobile_app': '모바일 앱 개발',
    'desktop_app': '데스크톱 앱 개발',
    'ai_ml': 'AI/ML 솔루션',
    'blockchain': '블록체인',
    'iot': 'IoT 시스템',
    'consulting': '컨설팅',
    'maintenance': '유지보수',
    'other': '기타'
  };
  return typeMap[type] || type;
}

// 예산 범위 한글 변환
function getBudgetKorean(budget: string): string {
  const budgetMap: Record<string, string> = {
    'under_1000': '100만원 미만',
    '1000_to_3000': '100-300만원',
    '3000_to_5000': '300-500만원',
    '5000_to_10000': '500-1000만원',
    'over_10000': '1000만원 이상',
    'negotiable': '협의 가능'
  };
  return budgetMap[budget] || budget;
}

// 타임라인 한글 변환
function getTimelineKorean(timeline: string): string {
  const timelineMap: Record<string, string> = {
    'asap': '가능한 빨리',
    '1_month': '1개월 이내',
    '1_3_months': '1-3개월',
    '3_6_months': '3-6개월',
    '6_12_months': '6-12개월',
    'over_1_year': '1년 이상',
    'flexible': '유연함'
  };
  return timelineMap[timeline] || timeline;
}

// 일반 상담신청 메시지 템플릿
export function createConsultationMessage(data: SlackNotificationData): SlackMessage {
  const isGuided = data.consultationType === 'guided';
  const emoji = isGuided ? '📋' : '💬';
  const title = isGuided ? '가이드 상담신청' : '자유 상담신청';

  const message: SlackMessage = {
    text: `${emoji} 새로운 ${title}이 접수되었습니다!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} 새로운 ${title}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*고객명:*\n${data.clientName}`
          },
          {
            type: 'mrkdwn',
            text: `*연락처:*\n${data.phone}`
          },
          {
            type: 'mrkdwn',
            text: `*이메일:*\n${data.email}`
          },
          {
            type: 'mrkdwn',
            text: `*상담번호:*\n${data.consultationNumber}`
          }
        ]
      }
    ]
  };

  // 회사명이 있는 경우 추가
  if (data.company && message.blocks && message.blocks[1]) {
    const sectionBlock = message.blocks[1] as { type: 'section'; fields?: Array<{ type: string; text: string }> };
    if (sectionBlock.fields) {
      sectionBlock.fields.splice(2, 0, {
        type: 'mrkdwn',
        text: `*회사명:*\n${data.company}`
      });
    }
  }

  // 가이드 상담인 경우 추가 정보
  if (isGuided) {
    const guidedFields: Array<{ type: 'mrkdwn'; text: string }> = [];

    if (data.serviceType) {
      guidedFields.push({
        type: 'mrkdwn',
        text: `*서비스 유형:*\n${getProjectTypeKorean(data.serviceType)}`
      });
    }

    if (data.budget) {
      guidedFields.push({
        type: 'mrkdwn',
        text: `*예산:*\n${getBudgetKorean(data.budget)}`
      });
    }

    if (data.timeline) {
      guidedFields.push({
        type: 'mrkdwn',
        text: `*일정:*\n${getTimelineKorean(data.timeline)}`
      });
    }

    if (data.projectSize) {
      guidedFields.push({
        type: 'mrkdwn',
        text: `*프로젝트 규모:*\n${data.projectSize}`
      });
    }

    if (guidedFields.length > 0) {
      message.blocks!.push({
        type: 'section',
        fields: guidedFields
      });
    }

    // 중요 기능이 있는 경우
    if (data.importantFeatures && data.importantFeatures.length > 0) {
      message.blocks!.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*중요 기능:*\n${data.importantFeatures.join(', ')}`
        }
      });
    }

    // 추가 요청사항
    if (data.additionalRequests) {
      message.blocks!.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*추가 요청사항:*\n${data.additionalRequests}`
        }
      });
    }
  } else {
    // 자유 상담인 경우 프로젝트 설명
    if (data.projectDescription) {
      message.blocks!.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*프로젝트 설명:*\n${data.projectDescription}`
        }
      });
    }
  }

  // 액션 버튼
  message.blocks!.push({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '관리자 페이지에서 확인'
        },
        url: getAdminUrl(data.consultationNumber),
        style: 'primary'
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '고객에게 연락하기'
        },
        url: `tel:${data.phone.replace(/\D/g, '')}`
      }
    ]
  });

  // 컨텍스트 정보
  const contextElements: Array<{ type: 'mrkdwn' | 'plain_text'; text: string }> = [
    {
      type: 'mrkdwn',
      text: `📅 접수시간: ${formatKoreanTime(data.createdAt)}`
    }
  ];

  if (data.utmSource) {
    contextElements.push({
      type: 'mrkdwn',
      text: `🌐 유입: ${data.utmSource}`
    });
  }

  message.blocks!.push({
    type: 'context',
    elements: contextElements
  });

  return message;
}

// 긴급 상담신청 메시지 템플릿
export function createUrgentConsultationMessage(data: SlackNotificationData): SlackMessage {
  const message = createConsultationMessage(data);

  // 헤더를 긴급으로 변경
  message.text = `🚨 긴급 상담신청이 접수되었습니다!`;
  message.blocks![0] = {
    type: 'header',
    text: {
      type: 'plain_text',
      text: `🚨 긴급 상담신청`
    }
  };

  // 긴급 알림 섹션 추가
  message.blocks!.splice(1, 0, {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '⚠️ *이 상담은 긴급 처리가 필요합니다. 즉시 확인해주세요!*'
    }
  });

  return message;
}

// 에러 알림 메시지 템플릿
export function createErrorMessage(data: ErrorNotificationData): SlackMessage {
  return {
    text: `❌ 시스템 오류가 발생했습니다!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '❌ 시스템 오류 알림'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*오류 내용:*\n${data.error}`
          },
          {
            type: 'mrkdwn',
            text: `*발생 위치:*\n${data.context}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*발생 시간:*\n${formatKoreanTime(data.timestamp)}`
          },
          {
            type: 'mrkdwn',
            text: `*요청 ID:*\n${data.requestId || 'N/A'}`
          }
        ]
      },
      ...(data.stack ? [{
        type: 'section' as const,
        text: {
          type: 'mrkdwn' as const,
          text: `*스택 트레이스:*\n\`\`\`${data.stack.slice(0, 500)}${data.stack.length > 500 ? '...' : ''}\`\`\``
        }
      }] : []),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '관리자 페이지 확인'
            },
            url: getAdminUrl(),
            style: 'danger'
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '🔍 즉시 확인이 필요한 시스템 오류입니다.'
          }
        ]
      }
    ]
  };
}

// 일일 요약 메시지 템플릿
export function createDailySummaryMessage(data: DailySummaryData): SlackMessage {
  const totalConsultations = data.totalConsultations;
  const hasConsultations = totalConsultations > 0;

  return {
    text: `📊 ${data.date} 상담 현황 요약`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📊 ${data.date} 상담 현황`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*총 상담 수:*\n${totalConsultations}건`
          },
          {
            type: 'mrkdwn',
            text: `*대기 중:*\n${data.pendingCount}건`
          },
          {
            type: 'mrkdwn',
            text: `*가이드 상담:*\n${data.guidedConsultations}건`
          },
          {
            type: 'mrkdwn',
            text: `*자유 상담:*\n${data.freeConsultations}건`
          }
        ]
      },
      ...(hasConsultations && data.topProjectTypes.length > 0 ? [{
        type: 'section' as const,
        text: {
          type: 'mrkdwn' as const,
          text: `*인기 프로젝트 유형:*\n${data.topProjectTypes.map(item => `• ${item.type}: ${item.count}건`).join('\n')}`
        }
      }] : []),
      ...(hasConsultations && data.topBudgetRanges.length > 0 ? [{
        type: 'section' as const,
        text: {
          type: 'mrkdwn' as const,
          text: `*예산 분포:*\n${data.topBudgetRanges.map(item => `• ${item.range}: ${item.count}건`).join('\n')}`
        }
      }] : []),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '상세 분석 보기'
            },
            url: getAdminUrl(),
            style: 'primary'
          }
        ]
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📅 생성 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
          }
        ]
      }
    ]
  };
}